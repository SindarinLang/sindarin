import llvm from "llvm-bindings";
import { LLVMFile, SymbolTable } from "./file";
import { isIntegerNode, isFloatNode, isIdentifierNode, isBooleanNode } from "../parse/node";
import { ArgumentsNode } from "../parse/root/value/identifier/arguments";
import { getPrimitive, Primitive, primitives } from "./primitive";

export type GetFunctionTypeFn = (builder: llvm.IRBuilder) => llvm.FunctionType;

export function getSignature(node: ArgumentsNode, symbolTable: SymbolTable) {
  return node.value.map((value) => {
    if(isBooleanNode(value)) {
      return primitives.int1;
    } else if(isIntegerNode(value)) {
      return primitives.int32;
    } else if(isFloatNode(value)) {
      return primitives.float;
    } else if(isIdentifierNode(value)) {
      return symbolTable[value.value].type;
    } else {
      throw new Error("Unknown signature");
    }
  });
}

export function buildFunction(name: string, returnType: Primitive, argumentTypes: Primitive[] = [], isVarArg = false) {
  return (file: LLVMFile) => {
    return llvm.Function.Create(
      llvm.FunctionType.get(
        getPrimitive(file.builder)(returnType),
        argumentTypes.map((type) => getPrimitive(file.builder)(type)),
        isVarArg
      ),
      llvm.Function.LinkageTypes.ExternalLinkage,
      name,
      file.mod
    );
  };
}
