import llvm from "llvm-bindings";
import { LLVMFile } from "./file";
import { getPrimitive, Primitive } from "./primitive";

export type GetFunctionTypeFn = (builder: llvm.IRBuilder) => llvm.FunctionType;

const getSignature = (file: LLVMFile, argumentTypes: Primitive[]) => {
  return argumentTypes.map((type) => getPrimitive(file, type));
};

export function buildFunction(name: string, returnType: Primitive, argumentTypes: Primitive[] = [], isVarArg = false) {
  return (file: LLVMFile) => {
    return llvm.Function.Create(
      llvm.FunctionType.get(
        getPrimitive(file, returnType),
        getSignature(file, argumentTypes),
        isVarArg
      ),
      llvm.Function.LinkageTypes.ExternalLinkage,
      name,
      file.mod
    );
  };
}
