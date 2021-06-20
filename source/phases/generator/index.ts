import llvm from "llvm-bindings";
import { PromisePhase, Options } from "..";
import { allSeries } from "../../utils";
import { getError } from "../error";
import { AST, ASTNode } from "../parser";
import { getFile, LLVMFile } from "./file";
import { buildRootStatement } from "./statement";
import { getReturn } from "./statement/return";
import { getFunction } from "./statement/tuple/value/function";
import { FunctionType, getBoolean, getType, Primitives } from "./types";

export type GeneratePhase<T extends ASTNode> = PromisePhase<T, LLVMFile>;

export type GenerateOptions = {
  /**
   * Default: "main"
   */
  fileName?: string;
};

export const getGenerateError = getError("Generate");

export const generate: GeneratePhase<AST> = async (ast: AST, options?: Options) => {
  const file = getFile(options?.generator?.fileName ?? "main");
  // Create Main Function
  const type: FunctionType = {
    primitive: "Function",
    isPointer: false,
    isOptional: false,
    argumentTypes: [],
    returnType: getType(Primitives.Boolean),
    name: options?.generator?.fileName ?? "main"
  };
  const fn = getFunction(file, type);
  // Push Scope
  const entry = llvm.BasicBlock.Create(file.context, "entry", fn);
  file.scopeStack.push({
    block: entry,
    symbolTable: {}
  });
  file.builder.SetInsertionPoint(entry);
  // Build Statements
  const statements = ast.value;
  await allSeries(statements.map((node) => () => buildRootStatement(file, node)));
  getReturn(file, [
    getBoolean(file, false)
  ]);
  // Pop Scope
  file.scopeStack.pop();
  if(file.scopeStack.length > 0) {
    file.builder.SetInsertionPoint(file.scopeStack[file.scopeStack.length-1].block);
  }
  return {
    context: ast,
    value: file,
    errors: []
  };
};

export {
  LLVMFile
};
