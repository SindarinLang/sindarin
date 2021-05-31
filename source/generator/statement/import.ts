import { isNode, Kinds } from "../../parser/node";
import { StatementNode } from "../../parser/statement";
import { getCore } from "../core";
import { LLVMFile } from "../file";

export function buildImport(file: LLVMFile, node: StatementNode) {
  if(isNode(node, Kinds.import) && node.from === undefined) {
    if(node.from) {
      throw new Error("'from' not yet supported");
    } else {
      const core = getCore(node.module, file);
      Object.keys(node.module.modules ?? {}).forEach((key) => {
        file.symbolTable[key] = core.exports[key];
      });
      file.imports.push(core);
    }
  }
}
