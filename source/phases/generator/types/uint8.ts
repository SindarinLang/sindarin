import llvm from "llvm-bindings";
import { LLVMFile } from "..";
import { getType, LLVMValue, Primitives, SymbolValue } from ".";

export function getUInt8Type(file: LLVMFile) {
  return llvm.Type.getInt8Ty(file.context);
}

export function getUInt8Value(file: LLVMFile, value: number | LLVMValue) {
  return typeof value === "number" ? llvm.ConstantInt.get(getUInt8Type(file), value, false) : value;
}

export function getUInt8(file: LLVMFile, value: number | LLVMValue): SymbolValue {
  return {
    type: getType(Primitives.UInt8),
    value: getUInt8Value(file, value)
  };
}

export function isUInt8(symbol: SymbolValue) {
  return symbol.type.primitive === Primitives.UInt8;
}
