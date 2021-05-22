import { isBoolean, isFloat, isInteger, isOperator } from "../../../parse/node";
import { ValueNode } from "../../../parse/root/value";
import { LLVMFile, SymbolValue } from "../../file";
import { primitives } from "../../primitive";
import { buildOperation } from "./operation";
import { buildFloat } from "./float";
import { buildInteger } from "./integer";
import { buildBoolean } from "./boolean";

export function buildValue(file: LLVMFile, node: ValueNode): SymbolValue {
  if(isInteger(node)) {
    return {
      type: primitives.int32,
      value: buildInteger(file, node.value)
    };
  } else if(isFloat(node)) {
    return {
      type: primitives.float,
      value: buildFloat(file, node.value)
    };
  } else if(isBoolean(node)) {
    return {
      type: primitives.int1,
      value: buildBoolean(file, node.value)
    };
  } else if(isOperator(node)) {
    return buildOperation(file, node);
  } else {
    throw new Error("Unsupported value");
  }
}
