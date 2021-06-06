import { extname, isAbsolute } from "path";
import { getResolveError, extension, ResolveResult } from "..";

export function resolveExact(path: string): ResolveResult {
  const result: ResolveResult = {
    context: path,
    value: [],
    errors: []
  };
  if(!isAbsolute(path)) {
    result.errors.push(getResolveError(`File '${path}' is not an absolute path`));
  }
  if(extname(path) !== extension) {
    result.errors.push(getResolveError(`File '${path}' is missing extension '${extension}'`));
  }
  if(result.errors.length === 0) {
    result.value?.push(path);
  }
  return result;
}
