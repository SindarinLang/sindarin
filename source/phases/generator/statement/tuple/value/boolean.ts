import { BooleanNode } from "../../../../parser";
import { LLVMFile } from "../../../file";
import { getBoolean } from "../../../types";

export function buildBoolean(file: LLVMFile, node: BooleanNode) {
  return [
    getBoolean(file, node.value)
  ];
}
