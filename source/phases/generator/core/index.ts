import llvm from "llvm-bindings";
import { ModuleNode } from "../../parser";
import { getFile, LLVMFile } from "../file";
import { getInt32Type, SymbolValue, Primitives } from "../types";
import { output } from "./output";
import { random } from "./random";

type LLVMFunctionBuilder = (exporter: LLVMFile, importer: LLVMFile) => SymbolValue[];

const core: {
  [name: string]: LLVMFunctionBuilder;
} = {
  output,
  random
};

export const coreFile = getFile("sindarin");
coreFile.structs.Rune = llvm.StructType.create(coreFile.context, [
  getInt32Type(coreFile),
  llvm.Type.getInt8PtrTy(coreFile.context)
], Primitives.Rune);
coreFile.structs.Int32 = llvm.Type.getInt32Ty(coreFile.context);
export function getCore(moduleNode: ModuleNode, importer: LLVMFile) {
  Object.keys(moduleNode.modules ?? {}).forEach((key: string) => {
    if(core[key]) {
      coreFile.exports[key] = core[key](coreFile, importer);
    } else {
      throw new Error(`module '${key}' does not exist`);
    }
  });
  return coreFile;
}
