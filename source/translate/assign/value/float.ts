import llvm from "llvm-bindings";
import { LLVMFile } from "../../file";

export function buildFloat(file: LLVMFile, value: number) {
  return llvm.ConstantFP.get(file.builder.getFloatTy(), value);
}

export function castFloat(file: LLVMFile, value: llvm.Value) {
  return file.builder.CreateSIToFP(value, file.builder.getFloatTy());
}
