import llvm from "llvm-bindings";
import { BooleanNode } from "../../../parser/statement/tuple/expression/operand/value-operation/value/boolean";
import { LLVMFile, SymbolValue } from "../../file";
import { isFloat, isInteger, isBoolean, primitives } from "../../primitive";
import { getFloat } from "./float";
import { getInteger } from "./integer";

export function castBoolean(file: LLVMFile, symbol: SymbolValue) {
  if(isBoolean(symbol.type)) {
    return symbol.value;
  } else if(isInteger(symbol.type)) {
    return file.builder.CreateICmpNE(symbol.value, getInteger(file, 0));
  } else if(isFloat(symbol.type)) {
    return file.builder.CreateFCmpONE(symbol.value, getFloat(file, 0));
  } else {
    throw new Error("Unsupported cast to boolean");
  }
}

export function getBoolean(file: LLVMFile, value: boolean) {
  return llvm.ConstantInt.get(file.builder.getInt1Ty(), value ? 1 : 0, false);
}

export function buildBoolean(file: LLVMFile, node: BooleanNode) {
  return {
    type: primitives.int1,
    value: getBoolean(file, node.value)
  };
}


