import { IdentifierNode } from "../../../../parser/statement/tuple/value/identifier";
import { getSymbol, LLVMFile } from "../../../file";

export function buildIdentifier(file: LLVMFile, node: IdentifierNode) {
  const identifier = getSymbol(file, node.value);
  if(identifier) {
    return identifier;
  } else {
    throw new Error("Undefined identifier");
  }
}
