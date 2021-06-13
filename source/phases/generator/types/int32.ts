import llvm from "llvm-bindings";
import { LLVMFile } from "..";
import { getType, LLVMValue, Primitives, SymbolValue } from ".";

export function getInt32Type(file: LLVMFile) {
  return llvm.Type.getInt32Ty(file.context);
}

export function getInt32Value(file: LLVMFile, value: number | LLVMValue) {
  return typeof value === "number" ? llvm.ConstantInt.get(getInt32Type(file), value) : value;
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
