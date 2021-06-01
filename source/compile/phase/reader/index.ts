import { readFile } from "read-file-safe";
import { FileLocation, getLocation } from "./location";
import { Phase } from "..";
import { getError } from "../../error";

export type File = {
  location: FileLocation;
  contents: string;
};

type ReadPhase = Phase<string, File>;

const getReadError = getError("Read");

export function startsWith(file: File, string: string) {
  return file.contents.startsWith(string);
}

export function hasAt(file: File, index: number, char: string) {
  return file.contents.length > index && file.contents[index] === char;
}

export function getLength(file: File) {
  return file.contents.length;
}

export const read: ReadPhase = async (path: string) => {
  const contents = await readFile(path) as string | undefined;
  if(contents) {
    return {
      value: {
        location: getLocation(path),
        contents
      },
      errors: []
    };
  } else {
    return {
      value: undefined,
      errors: [
        getReadError(`Could not read file '${path}'`)
      ]
    };
  }
};

export {
  FileLocation,
  getLocation
};
