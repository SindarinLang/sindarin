import llvm from "llvm-bindings";
import { BooleanNode } from "../../../parser/statement/tuple/expression/operand/value-operation/value/boolean";
import { LLVMFile, SymbolValue } from "../../file";
import { isFloat, isInteger, isBoolean, castFromPointer, Types, getLLVMBaseType } from "../../primitive";
import { getFloat } from "./float";
import { getInteger } from "./integer";

export function castBoolean(file: LLVMFile, symbol: SymbolValue) {
  if(isBoolean(symbol)) {
    return symbol.value;
  } else if(isInteger(symbol)) {
    const value = castFromPointer(file, symbol).value;
    return file.builder.CreateICmpNE(value, getInteger(file, 0));
  } else if(isFloat(symbol)) {
    const value = castFromPointer(file, symbol).value;
    return file.builder.CreateFCmpONE(value, getFloat(file, 0));
  } else {
    throw new Error("Unsupported cast to boolean");
  }
}

export function getBoolean(file: LLVMFile, value: boolean) {
  return llvm.ConstantInt.get(getLLVMBaseType(file, Types.Boolean), value ? 1 : 0, false);
}

export function buildBoolean(file: LLVMFile, node: BooleanNode) {
  return {
    type: Types.Boolean,
    value: getBoolean(file, node.value)
  };
}


