import { Tokens } from "../../../../../scanner";
import { BinaryOperationNode } from "../../../../../parser/statement/tuple/binary-operation";
import { LLVMFile, SymbolValue } from "../../../../file";
import { castToPointer } from "../../../../primitive";
import { getNull } from "../null";

export function buildDefaultOperation(file: LLVMFile, left: SymbolValue, node: BinaryOperationNode, right: SymbolValue) {
  if(node.operator === Tokens.default) {
    const leftPointer = castToPointer(file, left).value;
    const isDefined = file.builder.CreateICmpNE(leftPointer, getNull(file, right.type));
    const rightPointer = castToPointer(file, right).value;
    return {
      type: right.type,
      isPointer: true,
      value: file.builder.CreateSelect(isDefined, leftPointer, rightPointer)
    };
  } else {
    return undefined;
  }
}
