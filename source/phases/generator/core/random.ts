import llvm from "llvm-bindings";
import { LLVMFile } from "../file";
import { FunctionType, Primitives, SymbolValue } from "../types";
import { getFunction } from "../statement/tuple/value/function";

export function random(exporter: LLVMFile, importer: LLVMFile): SymbolValue[] {
  const type: FunctionType = {
    primitive: "Function",
    isPointer: false,
    isOptional: false,
    returnType: {
      primitive: Primitives.Int32,
      isPointer: false,
      isOptional: false
    },
    argumentTypes: [],
    name: "rand"
  };
  const rand = getFunction(exporter, type);
  const fn = getFunction(exporter, type);
  const entryBlock = llvm.BasicBlock.Create(exporter.context, "entry", fn);
  exporter.builder.SetInsertionPoint(entryBlock);
  const result = exporter.builder.CreateCall(rand, []);
  exporter.builder.CreateRet(result);
  if(!llvm.verifyFunction(fn)) {
    return [{
      value: getFunction(importer, type),
      type
    }];
  } else {
    throw new Error("Function verification failed");
  }
}
