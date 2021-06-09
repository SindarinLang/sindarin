import { join, extname } from "path";
import { ResolveResult } from "..";
import { resolveExtension } from "./extension";

export const index = "index";

export function resolveIndex(from: string): ResolveResult {
  if(!extname(from)) {
    return resolveExtension(join(from, `${index}`));
  } else {
    return {
      context: from,
      value: [],
      errors: []
    };
  }
}
