import { isNode, Kinds, StatementNode } from "../../parser";
import { getCore } from "../core";
import { LLVMFile, setSymbol } from "../file";

export function buildImport(file: LLVMFile, node: StatementNode) {
  if(isNode(node, Kinds.import) && node.from === undefined) {
    if(node.from) {
      throw new Error("'from' not yet supported");
    } else {
      const core = getCore(node.module, file);
      Object.keys(node.module.modules ?? {}).forEach((key) => {
        setSymbol(file, key, core.exports[key]);
      });
      file.imports.push(core);
    }
  }
}
