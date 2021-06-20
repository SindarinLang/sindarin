import { LLVMFile } from "../../..";
import { RuneNode } from "../../../../parser";
import { getRune, SymbolValue } from "../../../types";

export function buildRune(file: LLVMFile, node: RuneNode): SymbolValue {
  return getRune(file, node.value);
}
