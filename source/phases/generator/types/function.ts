import llvm from "llvm-bindings";
import { LLVMFile } from "..";
import { Type, getLLVMType, Primitives, SymbolValue, isSameType } from ".";

export interface FunctionType extends Type {
  argumentTypes: Type[];
  returnType: Type;
  isVarArg?: boolean;
}

export function isSameFunctionType(a: FunctionType, b: FunctionType): boolean {
  return a.argumentTypes.length === b.argumentTypes.length && a.argumentTypes.reduce((retval, argType, index) => {
    return retval && isSameType(argType, b.argumentTypes[index]);
  }, isSameType(a.returnType, b.returnType));
}

export function isFunctionType(type: Type): type is FunctionType {
  return type.primitive === Primitives.Function;
}

export function isFunction(symbol: SymbolValue): symbol is SymbolValue<llvm.Function, FunctionType> {
  return isFunctionType(symbol.type);
}

export function getFunctionType(file: LLVMFile, type: FunctionType) {
  return llvm.FunctionType.get(
    getLLVMType(file, type.returnType),
    type.argumentTypes.map((argType) => getLLVMType(file, argType)),
    type.isVarArg ?? false
  );
}
