import { AssignmentNode } from "../parser/statement/assignment";
import { LLVMFile } from "./file";
import { buildTuple } from "./tuple";

export function buildAssign(file: LLVMFile, node: AssignmentNode) {
  file.symbolTable[node.declaration.identifier.value] = buildTuple(file, node.value)[0];
}
