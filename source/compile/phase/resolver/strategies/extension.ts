import { format, extname } from "path";
import { extension, ResolvePhase } from "..";
import { resolveRelative } from "./relative";

export const resolveExtension: ResolvePhase = async (from: string) => {
  if(extname(from) === extension) {
    return resolveRelative(from);
  } else {
    return resolveRelative(format({ root: from, ext: extension }));
  }
};
