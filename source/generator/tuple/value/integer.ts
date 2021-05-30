import llvm from "llvm-bindings";
import { IntegerNode } from "../../../parser/statement/tuple/expression/operand/value-operation/value/integer";
import { LLVMFile } from "../../file";
import { primitives } from "../../primitive";

export function getInteger(file: LLVMFile, value: number) {
  return llvm.ConstantInt.get(file.builder.getInt32Ty(), value, true);
}

export function buildInteger(file: LLVMFile, node: IntegerNode) {
  return {
    type: primitives.int32,
    value: getInteger(file, node.value)
  };
}
