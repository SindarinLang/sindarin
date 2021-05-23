import { LLVMFile } from "./file";
import { CallNode } from "../parse/root/value/identifier";
import { buildArguments } from "./arguments";

export function buildCall(file: LLVMFile, node: CallNode) {
  const args = buildArguments(file, node.call);
  const fn = file.functionTable[node.value](args.map((arg) => arg.type));
  return file.builder.CreateCall(fn, args.map((arg) => arg.value));
}
