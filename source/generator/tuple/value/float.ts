import llvm from "llvm-bindings";
import { FloatNode } from "../../../parser/statement/tuple/expression/operand/value-operation/value/float";
import { LLVMFile, SymbolValue } from "../../file";
import { isInteger, isFloat, primitives } from "../../primitive";

export function castFloat(file: LLVMFile, symbol: SymbolValue) {
  if(isFloat(symbol.type)) {
    return symbol.value;
  } else if(isInteger(symbol.type)) {
    return file.builder.CreateSIToFP(symbol.value, file.builder.getFloatTy());
  } else {
    throw new Error("Unsupported cast to float");
  }
}

export function getFloat(file: LLVMFile, value: number) {
  return llvm.ConstantFP.get(file.builder.getFloatTy(), value);
}

export function buildFloat(file: LLVMFile, node: FloatNode) {
  return {
    type: primitives.float,
    value: getFloat(file, node.value)
  };
}
