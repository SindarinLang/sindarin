import { extname } from "path";
import { fileExists } from "file-exists-safe";
import { ResolvePhase, getResolveError, extension } from "..";

export const resolveExact: ResolvePhase = async (path: string) => {
  if(extname(path) === extension) {
    if(await fileExists(path)) {
      return {
        value: path,
        errors: []
      };
    } else {
      return {
        value: undefined,
        errors: [
          getResolveError(`File '${path}' does not exist`)
        ]
      };
    }
  } else {
    return {
      value: undefined,
      errors: [
        getResolveError(`File '${path}' missing extension`)
      ]
    };
  }
};
