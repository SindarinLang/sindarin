import { IdentifierNode } from "../../../../parser/statement/tuple/value/identifier";
import { getSymbol, LLVMFile } from "../../../file";

export function buildIdentifier(file: LLVMFile, node: IdentifierNode) {
  return getSymbol(file, node.value);
}
