import llvm from "llvm-bindings";
import { NumberNode } from "../../../../parser";
import { LLVMFile } from "../../../file";
import { getLLVMBaseType, Types } from "../../../primitive";

export function getInteger(file: LLVMFile, value: number) {
  return llvm.ConstantInt.get(getLLVMBaseType(file, Types.Int32), value, true);
}

export function buildInteger(file: LLVMFile, node: NumberNode) {
  return {
    type: Types.Int32,
    value: getInteger(file, node.value)
  };
}
