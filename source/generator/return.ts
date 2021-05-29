import llvm from "llvm-bindings";
import { LLVMFile } from "./file";

export function buildReturn(file: LLVMFile, value: llvm.Value) {
  file.builder.CreateRet(value);
}
