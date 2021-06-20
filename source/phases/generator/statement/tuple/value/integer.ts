import { NumberNode } from "../../../../parser";
import { LLVMFile } from "../../../file";
import { getInt32 } from "../../../types";

export function buildInteger(file: LLVMFile, node: NumberNode) {
  return getInt32(file, node.value);
}
