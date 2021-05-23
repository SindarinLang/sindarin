import { isBooleanNode, isFloatNode, isIntegerNode, isOperatorNode } from "../../../parse/node";
import { ValueNode } from "../../../parse/root/value";
import { LLVMFile, SymbolValue } from "../../file";
import { buildOperation } from "./operation";
import { buildFloat } from "./float";
import { buildInteger } from "./integer";
import { buildBoolean } from "./boolean";

export function buildValue(file: LLVMFile, node: ValueNode): SymbolValue {
  if(isIntegerNode(node)) {
    return buildInteger(file, node.value);
  } else if(isFloatNode(node)) {
    return buildFloat(file, node.value);
  } else if(isBooleanNode(node)) {
    return buildBoolean(file, node.value);
  } else if(isOperatorNode(node)) {
    return buildOperation(file, node);
  } else {
    throw new Error("Unsupported value");
  }
}
