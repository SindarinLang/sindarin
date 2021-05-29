import { isBooleanNode, isCallNode, isFloatNode, isIdentifierNode, isIntegerNode, isOperatorNode } from "../../parser/node";
import { ValueNode } from "../../parser/statement/expression";
import { LLVMFile, SymbolValue } from "../file";
import { buildOperation } from "./operation";
import { buildFloat } from "./float";
import { buildInteger } from "./integer";
import { buildBoolean } from "./boolean";
import { buildCall } from "../call";

export function buildValue(file: LLVMFile, node: ValueNode): SymbolValue {
  if(isIntegerNode(node)) {
    return buildInteger(file, node.value);
  } else if(isFloatNode(node)) {
    return buildFloat(file, node.value);
  } else if(isBooleanNode(node)) {
    return buildBoolean(file, node.value);
  } else if(isOperatorNode(node)) {
    return buildOperation(file, node);
  } else if(isCallNode(node)) {
    return buildCall(file, node);
  } else if(isIdentifierNode(node)) {
    return file.symbolTable[node.value];
  } else {
    throw new Error("Unsupported value");
  }
}
