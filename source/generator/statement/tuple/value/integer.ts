import llvm from "llvm-bindings";
import { IntegerNode } from "../../../../parser/statement/tuple/expression/operand/value-operation/value/integer";
import { LLVMFile } from "../../../file";
import { getLLVMBaseType, Types } from "../../../primitive";

export function getInteger(file: LLVMFile, value: number) {
  return llvm.ConstantInt.get(getLLVMBaseType(file, Types.Int32), value, true);
}

export function buildInteger(file: LLVMFile, node: IntegerNode) {
  return {
    type: Types.Int32,
    value: getInteger(file, node.value)
  };
}
