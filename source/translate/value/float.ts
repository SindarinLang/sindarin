import llvm from "llvm-bindings";
import { LLVMFile, SymbolValue } from "../file";
import { isInteger, isFloat, primitives } from "../primitive";

export function buildFloat(file: LLVMFile, value: number) {
  return {
    type: primitives.float,
    value: llvm.ConstantFP.get(file.builder.getFloatTy(), value)
  };
}

export function castFloat(file: LLVMFile, symbol: SymbolValue) {
  if(isFloat(symbol.type)) {
    return symbol.value;
  } else if(isInteger(symbol.type)) {
    return file.builder.CreateSIToFP(symbol.value, file.builder.getFloatTy());
  } else {
    throw new Error("Unsupported cast to float");
  }
}
