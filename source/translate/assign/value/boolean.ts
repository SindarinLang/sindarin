import llvm from "llvm-bindings";
import { LLVMFile } from "../../file";

export function buildBoolean(file: LLVMFile, value: boolean) {
  return llvm.ConstantInt.get(file.builder.getInt1Ty(), value ? 1 : 0, false);
}
