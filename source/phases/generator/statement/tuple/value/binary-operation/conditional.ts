import { Tokens } from "../../../../../scanner";
import { BinaryOperationNode } from "../../../../../parser";
import { LLVMFile } from "../../../../file";
import { castToBoolean, getNull, getType, SymbolValue, toPointer } from "../../../../types";

export function buildConditionalOperation(file: LLVMFile, left: SymbolValue, node: BinaryOperationNode, right: SymbolValue): SymbolValue | undefined {
  if(node.operator === Tokens.conditional) {
    const rightPointer = toPointer(file, right).value;
    const nullPointer = getNull(file, right.type);
    const isTruthy = castToBoolean(file, left).value;
    return {
      type: getType(right.type.primitive, true, true),
      value: file.builder.CreateSelect(isTruthy, rightPointer, nullPointer)
    };
  } else {
    return undefined;
  }
}
