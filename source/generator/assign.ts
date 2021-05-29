import { AssignmentNode } from "../parser/statement/assignment";
import { LLVMFile } from "./file";
import { buildValue } from "./value";

export function buildAssign(file: LLVMFile, node: AssignmentNode) {
  file.symbolTable[node.declaration.identifier.value] = buildValue(file, node.value);
}
