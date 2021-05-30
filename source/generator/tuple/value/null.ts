import llvm from "llvm-bindings";
import { NullNode } from "../../../parser/statement/tuple/expression/operand/value-operation/value/null";
import { LLVMFile } from "../../file";
import { primitives } from "../../primitive";

export function buildNull(file: LLVMFile, node: NullNode) {
  // TODO: get correct type
  return {
    type: primitives.int32Ptr,
    value: llvm.ConstantPointerNull.get(llvm.Type.getInt32PtrTy(file.context))
  };
}
