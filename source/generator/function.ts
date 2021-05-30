import llvm from "llvm-bindings";
import { LLVMFile, SymbolValue } from "./file";
import { getLLVMType, Primitive, Types } from "./primitive";

export type GetFunctionTypeFn = (builder: llvm.IRBuilder) => llvm.FunctionType;

type Override<T = any> = {
  fn: T;
  signature: Types[][];
};

export type Overrides<T = any> = Override<T>[];

export function getSignature(symbols: SymbolValue[]) {
  return symbols.map((symbol) => symbol.type);
}

export function getLLVMSignature(file: LLVMFile, argumentTypes: Primitive[]) {
  return argumentTypes.map((type) => getLLVMType(file, type));
}

export function matchSignature<T = any>(overrides: Overrides<T>, signature: Primitive[]) {
  return overrides.find((override) => {
    return override.signature.reduce((retval, arg, index) => {
      return retval && arg.includes(signature[index].type);
    }, true as boolean);
  })?.fn ?? (() => undefined);
}

export function buildFunction(name: string, returnType: Primitive, argumentTypes: Primitive[] = [], isVarArg = false) {
  return (file: LLVMFile) => {
    return llvm.Function.Create(
      llvm.FunctionType.get(
        getLLVMType(file, returnType),
        getLLVMSignature(file, argumentTypes),
        isVarArg
      ),
      llvm.Function.LinkageTypes.ExternalLinkage,
      name,
      file.mod
    );
  };
}
