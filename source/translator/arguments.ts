import { ArgumentsNode } from "../parser/root/value/identifier/arguments";
import { LLVMFile } from "./file";
import { buildValue } from "./value";

export function buildArguments(file: LLVMFile, node: ArgumentsNode) {
  return node.value.map((valueNode) => {
    return buildValue(file, valueNode);
  });
}
