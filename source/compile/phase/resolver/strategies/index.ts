import { join, extname } from "path";
import { extension, ResolvePhase } from "..";
import { resolveRelative } from "./relative";

export const index = "index";

export const resolveIndex: ResolvePhase = async (from: string) => {
  if(extname(from) === extension) {
    return resolveRelative(from);
  } else {
    return resolveRelative(join(from, `${index}${extension}`));
  }
};
