import { LLVMFile } from "./file";
import { buildArguments } from "./arguments";
import { CallNode } from "../parser/statement/tuple/expression/operand/value-operation/call";

export function buildCall(file: LLVMFile, node: CallNode) {
  const args = buildArguments(file, node.arguments);
  const fn = file.functionTable[node.callee](args.map((arg) => arg.type));
  return {
    type: fn.type,
    value: file.builder.CreateCall(fn.value, args.map((arg) => arg.value))
  };
}
