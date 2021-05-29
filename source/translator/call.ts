import { LLVMFile } from "./file";
import { CallNode } from "../parser/statement/expression/value/identifier";
import { buildArguments } from "./arguments";

export function buildCall(file: LLVMFile, node: CallNode) {
  const args = buildArguments(file, node.call);
  const fn = file.functionTable[node.value](args.map((arg) => arg.type));
  return {
    type: fn.type,
    value: file.builder.CreateCall(fn.value, args.map((arg) => arg.value))
  };
}
