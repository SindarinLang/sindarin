import llvm from "llvm-bindings";
import { LLVMFile } from "./file";
import { getPrimitive, Primitive } from "./primitive";

export type GetFunctionTypeFn = (builder: llvm.IRBuilder) => llvm.FunctionType;

export function buildFunction(name: string, returnType: Primitive, argumentTypes: Primitive[] = [], isVarArg = false) {
  return (file: LLVMFile) => {
    return llvm.Function.Create(
      llvm.FunctionType.get(
        getPrimitive(file.context)(returnType),
        argumentTypes.map((type) => getPrimitive(file.context)(type)),
        isVarArg
      ),
      llvm.Function.LinkageTypes.ExternalLinkage,
      name,
      file.mod
    );
  };
}
