import { AST } from "../parser";
import { getFile } from "./file";
import { buildFunction } from "./statement/tuple/value/function";

export function generate(ast: AST) {
  const file = getFile("main");
  buildFunction(file, ast);
  file.write();
}
