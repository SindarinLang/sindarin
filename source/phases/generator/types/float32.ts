import llvm from "llvm-bindings";
import { LLVMFile } from "..";
import { SymbolValue, Primitives, LLVMValue, getType } from ".";
import { isInt32 } from "./int32";

export function getFloat32Value(file: LLVMFile, value: number | LLVMValue) {
  return typeof value === "number" ? llvm.ConstantFP.get(file.types.Float32, value) : value;
}

export function getFloat32(file: LLVMFile, value: number | LLVMValue): SymbolValue {
  return {
    type: getType(Primitives.Float32),
    value: getFloat32Value(file, value)
  };
}

export function isFloat32(symbol: SymbolValue) {
  return symbol.type.primitive === Primitives.Float32;
}

export function castToFloat32(file: LLVMFile, symbol: SymbolValue) {
  if(isFloat32(symbol)) {
    return symbol;
  } else if(isInt32(symbol)) {
    return getFloat32(file, file.builder.CreateSIToFP(symbol.value, file.types.Float32));
  } else {
    throw new Error("Unsupported cast to float");
  }
}
