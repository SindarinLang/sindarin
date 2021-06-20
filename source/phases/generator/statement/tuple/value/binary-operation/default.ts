import { Tokens } from "../../../../../scanner";
import { BinaryOperationNode } from "../../../../../parser/statement/tuple/binary-operation";
import { LLVMFile } from "../../../../file";
import { getNull, getType, isSameType, SymbolValue, toPointer } from "../../../../types";

export function buildDefaultOperation(file: LLVMFile, left: SymbolValue, node: BinaryOperationNode, right: SymbolValue) {
  if(node.operator === Tokens.default) {
    if(isSameType(left.type, right.type)) {
      const leftPointer = toPointer(file, left).value;
      const isDefined = file.builder.CreateICmpNE(leftPointer, getNull(file, right.type));
      const rightPointer = toPointer(file, right).value;
      return {
        type: getType(left.type.primitive, true, left.type.isOptional && right.type.isOptional),
        value: file.builder.CreateSelect(isDefined, leftPointer, rightPointer)
      };
    } else {
      throw new Error("Default operator types must match");
    }
  } else {
    return undefined;
  }
}
