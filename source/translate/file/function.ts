import llvm from "llvm-bindings";
import { SymbolTable } from ".";
import { isInteger, isFloat, isIdentifier } from "../../parse/node";
import { ArgumentsNode } from "../../parse/root/value/identifier/arguments";
import { getPrimitive, Primitive, primitives } from "../primitive";

export type GetFunctionTypeFn = (builder: llvm.IRBuilder) => llvm.FunctionType;

export function getSignature(node: ArgumentsNode, symbolTable: SymbolTable) {
  return node.value.map((value) => {
    if(isInteger(value)) {
      return primitives.int32;
    } else if(isFloat(value)) {
      return primitives.float;
    } else if(isIdentifier(value)) {
      return symbolTable[value.value].type;
    } else {
      throw new Error("Unknown signature");
    }
  });
}

export function getFunctionType(returnType: Primitive, argumentTypes: Primitive[] = [], isVarArg = false) {
  return (builder: llvm.IRBuilder) => {
    return llvm.FunctionType.get(
      getPrimitive(builder)(returnType),
      argumentTypes.map((type) => getPrimitive(builder)(type)),
      isVarArg
    );
  };
}

export function createFunctionFn(builder: llvm.IRBuilder, mod: llvm.Module) {
  return (getType: GetFunctionTypeFn, name: string) => {
    return llvm.Function.Create(
      getType(builder),
      llvm.Function.LinkageTypes.ExternalLinkage,
      name,
      mod
    );
  };
}
