import llvm from "llvm-bindings";
import { LLVMFile, SymbolValue } from "../../../file";
import { isInteger, isFloat, Types, getLLVMBaseType, castFromPointer } from "../../../primitive";

export function castFloat(file: LLVMFile, symbol: SymbolValue) {
  if(isFloat(symbol)) {
    return symbol.value;
  } else if(isInteger(symbol)) {
    const value = castFromPointer(file, symbol).value;
    return file.builder.CreateSIToFP(value, getLLVMBaseType(file, Types.Float32));
  } else {
    throw new Error("Unsupported cast to float");
  }
}

export function getFloat(file: LLVMFile, value: number) {
  return llvm.ConstantFP.get(getLLVMBaseType(file, Types.Float32), value);
}
