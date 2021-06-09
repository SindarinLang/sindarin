import { isNode, Kinds } from "../../../parser/node";
import { StatementNode } from "../../../parser/statement";
import { LLVMFile } from "../../file";
import { buildValue } from "./value";

export function buildTuple(file: LLVMFile, node: StatementNode) {
  if(isNode(node, Kinds.tuple)) {
    return node.value.map((expressionNode) => {
      return buildValue(file, expressionNode);
    });
  } else {
    return [];
  }
}
