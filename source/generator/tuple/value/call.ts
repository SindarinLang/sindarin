import { buildTuple } from "..";
import { isNode, Kinds } from "../../../parser/node";
import { CallNode } from "../../../parser/statement/tuple/expression/operand/value-operation/call";
import { LLVMFile } from "../../file";

export function buildCall(file: LLVMFile, node: CallNode) {
  const args = buildTuple(file, node.arguments);
  if(isNode(node.callee, Kinds.identifier)) {
    const fn = file.functionTable[node.callee.value](args.map((arg) => arg.type));
    return {
      type: fn.type,
      value: file.builder.CreateCall(fn.value, args.map((arg) => arg.value))
    };
  } else {
    throw new Error("Unsupported callee");
  }
}
