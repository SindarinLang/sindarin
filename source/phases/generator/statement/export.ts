import { isNode, Kinds, StatementNode } from "../../parser";
import { LLVMFile } from "../file";

export function buildExport(file: LLVMFile, node: StatementNode) {
  if(isNode(node, Kinds.export)) {
    throw new Error("'export' not yet implemented");
  }
}
