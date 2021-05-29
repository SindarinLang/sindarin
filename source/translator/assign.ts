import { AssignNode } from "../parser/statement/assign";
import { LLVMFile } from "./file";
import { buildValue } from "./value";

export function buildAssign(file: LLVMFile, node: AssignNode) {
  file.symbolTable[node.identifier] = buildValue(file, node.value);
}
