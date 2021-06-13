import llvm from "llvm-bindings";
import { LLVMFile } from "..";
import { getType, Primitives, SymbolValue } from ".";
import { getInt32Value, isInt32 } from "./int32";
import { getFloat32Value, isFloat32 } from "./float32";

export function getBooleanValue(file: LLVMFile, value: boolean | llvm.Value) {
  return typeof value === "boolean" ? llvm.ConstantInt.get(getBooleanType(file), value ? 1 : 0) : value;
}

export function getBooleanType(file: LLVMFile): llvm.Type {
  return llvm.Type.getInt1Ty(file.context);
}

export function getBoolean(file: LLVMFile, value: boolean | llvm.Value): SymbolValue {
  return {
    type: getType(Primitives.Boolean),
    value: getBooleanValue(file, value)
  };
}

export function isBoolean(symbol: SymbolValue) {
  return symbol.type.primitive === Primitives.Boolean;
}

export function castToBoolean(file: LLVMFile, symbol: SymbolValue) {
  if(isBoolean(symbol)) {
    return symbol;
  } else if(isInt32(symbol)) {
    return getBoolean(file, file.builder.CreateICmpNE(symbol.value, getInt32Value(file, 0)));
  } else if(isFloat32(symbol)) {
    return getBoolean(file, file.builder.CreateFCmpONE(symbol.value, getFloat32Value(file, 0)));
  } else {
    throw new Error("Unsupported cast to boolean");
  }
}
