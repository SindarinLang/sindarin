import { isNode, Kinds } from "../../parser/node";
import { StatementNode } from "../../parser/statement";
import { LLVMFile, setSymbol } from "../file";
import { buildTuple } from "./tuple";

export function buildAssign(file: LLVMFile, node: StatementNode) {
  if(isNode(node, Kinds.assignment) && node.value) {
    setSymbol(file, node.declaration.identifier.value, buildTuple(file, node.value)[0]);
  }
}
