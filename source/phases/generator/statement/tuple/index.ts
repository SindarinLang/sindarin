import { isNode, Kinds, StatementNode } from "../../../parser";
import { LLVMFile } from "../../file";
import { SymbolValue } from "../../types";
import { buildValue } from "./value";

export function buildTuple(file: LLVMFile, node: StatementNode): SymbolValue[][] {
  if(isNode(node, Kinds.tuple)) {
    return node.value.map((expressionNode) => {
      return buildValue(file, expressionNode);
    });
  } else {
    return [];
  }
}
