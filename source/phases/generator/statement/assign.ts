import { isNode, Kinds, StatementNode } from "../../parser";
import { LLVMFile, setSymbol } from "../file";
import { buildTuple } from "./tuple";

export function buildAssign(file: LLVMFile, node: StatementNode) {
  if(isNode(node, Kinds.assignment) && node.value) {
    setSymbol(file, node.declaration.identifier.value, buildTuple(file, node.value)[0]);
  }
}
