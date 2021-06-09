import { resolve, isAbsolute } from "path";
import { ResolvePhase } from "..";
import { resolveExact } from "./exact";

export const resolveRelative: ResolvePhase = (from: string) => {
  if(!isAbsolute(from)) {
    const fullPath = resolve(process.cwd(), from);
    return resolveExact(fullPath);
  } else {
    return {
      context: from,
      value: [],
      errors: []
    };
  }
};
