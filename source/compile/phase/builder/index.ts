import { Phase } from "..";
import { getError } from "../../error";
import { AST } from "../parser";
import { getFile, LLVMFile } from "./file";
import { buildFunction } from "./statement/tuple/value/function";

export const getBuildError = getError("Build");

export const build: Phase<AST, LLVMFile> = (ast: AST) => {
  const file = getFile("main");
  buildFunction(file, ast);
  return {
    value: file,
    errors: []
  };
};
