import { Phase } from "..";
import { getError } from "../error";
import { AST, ASTNode } from "../parser";
import { coreFile } from "./core";
import { getFile, LLVMFile } from "./file";
import { buildFunction } from "./statement/tuple/value/function";

export type GeneratePhase<T extends ASTNode> = Phase<T, LLVMFile>;

export const getGenerateError = getError("Generate");

export const generate: GeneratePhase<AST> = (ast: AST) => {
  const file = getFile("main");
  file.structs = coreFile.structs;
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
