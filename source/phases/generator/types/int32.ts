import llvm from "llvm-bindings";
import { LLVMFile } from "..";
import { getType, LLVMValue, Primitives, SymbolValue } from ".";

export function getInt32Value(file: LLVMFile, value: number | LLVMValue) {
  return typeof value === "number" ? llvm.ConstantInt.get(file.types.Int32, value) : value;
}

export function getInt32(file: LLVMFile, value: number | LLVMValue): SymbolValue {
  return {
    type: getType(Primitives.Int32),
    value: getInt32Value(file, value)
  };
}

export function isInt32(symbol: SymbolValue) {
  return symbol.type.primitive === Primitives.Int32;
}
