import { Tokens } from "../../../../../scanner";
import { BinaryOperationNode } from "../../../../../parser";
import { LLVMFile } from "../../../../file";
import { castToBoolean, getNull, SymbolValue, toPointer } from "../../../../types";

export function buildConditionalOperation(file: LLVMFile, left: SymbolValue[], node: BinaryOperationNode, right: SymbolValue[]): SymbolValue | undefined {
  if(node.operator === Tokens.conditional) {
    const rightPointer = toPointer(file, right[0]).value;
    const nullPointer = getNull(file, right[0].type);
    const isTruthy = castToBoolean(file, left[0]).value;
    return {
      type: {
        ...right[0].type,
        isPointer: true,
        isOptional: true
      },
      value: file.builder.CreateSelect(isTruthy, rightPointer, nullPointer)
    };
  } else {
    return undefined;
  }
}
