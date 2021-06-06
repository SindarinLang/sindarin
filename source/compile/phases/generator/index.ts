import { Phase } from "..";
import { getError } from "../error";
import { AST } from "../parser";
import { getFile, LLVMFile } from "./file";
import { buildFunction } from "./statement/tuple/value/function";

export type GeneratePhase = Phase<AST, LLVMFile>;

export const getBuildError = getError("Build");

export const generate: GeneratePhase = (ast: AST) => {
  const file = getFile("main");
  buildFunction(file, ast);
  return {
    context: ast,
    value: file,
    errors: []
  };
};

export {
  LLVMFile
};
