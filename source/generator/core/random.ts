import llvm from "llvm-bindings";
import { LLVMFile, SymbolFunction } from "../file";
import { buildFunction } from "../function";
import { getPrimitive, Types } from "../primitive";

export function random(exporter: LLVMFile, importer: LLVMFile): SymbolFunction {
  const returnType = getPrimitive(Types.Int32);
  const rand = buildFunction("rand", returnType)(exporter);
  const template = buildFunction("_random", returnType);
  const fn = template(exporter);
  const entryBlock = llvm.BasicBlock.Create(exporter.context, "entry", fn);
  exporter.builder.SetInsertionPoint(entryBlock);
  const result = exporter.builder.CreateCall(rand, []);
  exporter.builder.CreateRet(result);
  if(!llvm.verifyFunction(fn)) {
    return [{
      value: template(importer),
      type: {
        argumentTypes: [],
        returnType
      }
    }];
  } else {
    throw new Error("Function verification failed");
  }
}
