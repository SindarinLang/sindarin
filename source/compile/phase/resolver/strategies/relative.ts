import { resolve } from "path";
import { resolveExact } from "./exact";

export function resolveRelative(path: string) {
  const fullPath = resolve(process.cwd(), path);
  return resolveExact(fullPath);
}
