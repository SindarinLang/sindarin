import { format, extname } from "path";
import { extension, ResolveResult } from "..";
import { resolveRelative } from "./relative";

export function resolveExtension(from: string): ResolveResult {
  if(extname(from) !== extension) {
    return resolveRelative(format({ root: from, ext: extension }));
  } else {
    return {
      context: from,
      value: [],
      errors: []
    };
  }
}
