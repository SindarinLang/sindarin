import { isNode, Kinds } from "../../parser/node";
import { StatementNode } from "../../parser/statement";
import { LLVMFile } from "../file";

export function buildExport(file: LLVMFile, node: StatementNode) {
  if(isNode(node, Kinds.export)) {
    throw new Error("'export' not yet implemented");
  }
}
