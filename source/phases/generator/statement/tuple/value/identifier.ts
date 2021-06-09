import { IdentifierNode } from "../../../../parser/statement/tuple/value/identifier";
import { LLVMFile } from "../../../file";

export function buildIdentifier(file: LLVMFile, node: IdentifierNode) {
  return file.symbolTable[node.value];
}
