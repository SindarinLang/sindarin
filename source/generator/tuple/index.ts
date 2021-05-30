import { TupleNode } from "../../parser/statement/tuple";
import { LLVMFile } from "../file";
import { buildValue } from "./value";

export function buildTuple(file: LLVMFile, node?: TupleNode) {
  if(node) {
    return node.value.value.map((expressionNode) => {
      return buildValue(file, expressionNode);
    });
  } else {
    return [];
  }
}
