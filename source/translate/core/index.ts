import llvm from "llvm-bindings";
import { ModuleNode } from "../../parse/root/modules";
import { getFile, LLVMFile } from "../file";
import { Primitive } from "../primitive";
import { output } from "./output";

type LLVMFunctionBuilder = (exporter: LLVMFile, importer: LLVMFile) => (argumentTypes: Primitive[]) => llvm.Function;

const core: {
  [name: string]: LLVMFunctionBuilder;
} = {
  output
};

export function getCore(moduleNode: ModuleNode, importer: LLVMFile) {
  const coreFile = getFile("sindarin");
  Object.keys(moduleNode.modules ?? {}).forEach((key: string) => {
    if(core[key]) {
      coreFile.exports[key] = core[key](coreFile, importer);
    } else {
      throw new Error(`module '${key}' does not exist`);
    }
  });
  return coreFile;
}
