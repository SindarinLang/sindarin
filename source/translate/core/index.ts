import llvm from "llvm-bindings";
import { ModuleNode } from "../../parse/root/modules";
import { getFile, LLVMFile } from "../file";
import { log } from "./log";

type LLVMFunctionBuilder = (file: LLVMFile) => llvm.Function | undefined;

const core: {
  [name: string]: LLVMFunctionBuilder;
} = {
  log
};

export function getCore(moduleNode: ModuleNode) {
  const file = getFile("sindarin");
  Object.keys(moduleNode.modules ?? {}).forEach((key: string) => {
    if(core[key]) {
      core[key](file);
    } else {
      throw new Error(`module '${key}' does not exist`);
    }
  });
  return file;
}
