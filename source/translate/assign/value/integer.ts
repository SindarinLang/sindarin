import llvm from "llvm-bindings";
import { LLVMFile } from "../../file";

export function buildInteger(file: LLVMFile, value: number) {
  return llvm.ConstantInt.get(file.builder.getInt32Ty(), value, false);
}
