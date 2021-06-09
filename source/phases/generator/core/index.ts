import { ModuleNode } from "../../parser/statement/modules/module";
import { getFile, LLVMFile, SymbolFunction } from "../file";
import { output } from "./output";
import { random } from "./random";

type LLVMFunctionBuilder = (exporter: LLVMFile, importer: LLVMFile) => SymbolFunction;

const core: {
  [name: string]: LLVMFunctionBuilder;
} = {
  output,
  random
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
