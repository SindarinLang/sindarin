import llvm from "llvm-bindings";
import { LLVMFile } from "../../file";
import { primitives } from "../../primitive";

export function buildInteger(file: LLVMFile, value: number) {
  return {
    type: primitives.int32,
    value: llvm.ConstantInt.get(file.builder.getInt32Ty(), value, true)
  };
}
