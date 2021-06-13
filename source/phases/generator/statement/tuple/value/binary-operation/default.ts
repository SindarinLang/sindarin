import { Tokens } from "../../../../../scanner";
import { BinaryOperationNode } from "../../../../../parser/statement/tuple/binary-operation";
import { LLVMFile } from "../../../../file";
import { getNull, isSameType, SymbolValue, toPointer } from "../../../../types";

export function buildDefaultOperation(file: LLVMFile, left: SymbolValue[], node: BinaryOperationNode, right: SymbolValue[]) {
  if(node.operator === Tokens.default) {
    if(isSameType(left[0].type, right[0].type)) {
      const leftPointer = toPointer(file, left[0]).value;
      const isDefined = file.builder.CreateICmpNE(leftPointer, getNull(file, right[0].type));
      const rightPointer = toPointer(file, right[0]).value;
      return {
        type: {
          ...left[0].type,
          isPointer: true,
          isOptional: left[0].type.isOptional && right[0].type.isOptional
        },
        value: file.builder.CreateSelect(isDefined, leftPointer, rightPointer)
      };
    } else {
      throw new Error("Default operator types must match");
    }
  } else {
    return undefined;
  }
}
