import { readFile } from "read-file-safe";
import { PromisePhase, Result } from "..";
import { getError } from "../error";
import { ResolveValue } from "../resolver";
import { FileLocation, getLocation, locationToString } from "./location";

export type ReadValue = {
  location: FileLocation;
  contents: string;
};

type ReadPhase = PromisePhase<ResolveValue, ReadValue>;

type ReadResult = Result<ReadPhase>;

const getReadError = getError("Read");

export function startsWith(file: ReadValue, string: string) {
  return file.contents.startsWith(string);
}

export function hasAt(file: ReadValue, index: number, char: string) {
  return file.contents.length > index && file.contents[index] === char;
}

export function getLength(file: ReadValue) {
  return file.contents.length;
}

export const read: ReadPhase = async (paths: ResolveValue) => {
  const result: ReadResult = {
    value: undefined,
    context: paths,
    errors: []
  };
  for(let i=0; i<paths.length; i+=1) {
    const path = paths[i];
    // eslint-disable-next-line no-await-in-loop
    const contents = await readFile(path) as string | undefined;
    if(contents !== undefined) {
      return {
        context: paths,
        value: {
          location: getLocation(path),
          contents
        },
        errors: []
      };
    } else {
      result.errors.push(getReadError(`Could not read file '${path}'`));
    }
  }
  return result;
};

export {
  FileLocation,
  getLocation,
  locationToString
};
