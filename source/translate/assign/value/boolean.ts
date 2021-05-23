import llvm from "llvm-bindings";
import { LLVMFile, SymbolValue } from "../../file";
import { isFloat, isInteger, isBoolean, primitives } from "../../primitive";
import { buildFloat } from "./float";
import { buildInteger } from "./integer";

export function buildBoolean(file: LLVMFile, value: boolean) {
  return {
    type: primitives.int1,
    value: llvm.ConstantInt.get(file.builder.getInt1Ty(), value ? 1 : 0, false)
  };
}

export function castBoolean(file: LLVMFile, symbol: SymbolValue) {
  if(isBoolean(symbol.type)) {
    return symbol.value;
  } else if(isInteger(symbol.type)) {
    return file.builder.CreateICmpNE(symbol.value, buildInteger(file, 0).value);
  } else if(isFloat(symbol.type)) {
    return file.builder.CreateFCmpONE(symbol.value, buildFloat(file, 0).value);
  } else {
    throw new Error("Unsupported cast to boolean");
  }
}
