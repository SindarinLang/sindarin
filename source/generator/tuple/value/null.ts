import llvm from "llvm-bindings";
import { NullNode } from "../../../parser/statement/tuple/expression/operand/value-operation/value/null";
import { LLVMFile, SymbolValue } from "../../file";
import { getLLVMPointerType, Types } from "../../primitive";

export function castNull(file: LLVMFile, symbol: SymbolValue) {
  const type = getLLVMPointerType(file, symbol.type);
  return llvm.ConstantPointerNull.get(type);
}

export function getNull(file: LLVMFile, type: Types) {
  return llvm.ConstantPointerNull.get(getLLVMPointerType(file, type));
}

// TODO: get correct type from NullNode
export function buildNull(file: LLVMFile, node: NullNode) {
  return {
    type: Types.Int32,
    isPointer: true,
    value: getNull(file, Types.Int32)
  };
}
