import { LLVMFile } from "./file";
import { buildInteger } from "./assign/value/integer";
import { buildFloat } from "./assign/value/float";
import { isIntegerNode, isFloatNode, isIdentifierNode } from "../parse/node";
import { CallNode } from "../parse/root/value/identifier";
import { getSignature } from "./function";

export function buildCall(file: LLVMFile, node: CallNode) {
  const signature = getSignature(node.call, file.symbolTable);
  const fn = file.functionTable[node.value](signature);
  return file.builder.CreateCall(fn, node.call.value.map((valueNode) => {
    if(isIdentifierNode(valueNode)) {
      return file.symbolTable[valueNode.value].value;
    } else if(isIntegerNode(valueNode)) {
      return buildInteger(file, valueNode.value).value;
    } else if(isFloatNode(valueNode)) {
      return buildFloat(file, valueNode.value).value;
    } else {
      return buildInteger(file, 0).value;
    }
  }));
}
