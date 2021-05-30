import { Tokens } from "../../../../lexer";
import { BinaryOperationNode } from "../../../../parser/statement/tuple/expression/binary-operation";
import { LLVMFile, SymbolValue } from "../../../file";
import { castToPointer } from "../../../primitive";
import { getNull } from "../null";

export function buildConditionalOperation(file: LLVMFile, left: SymbolValue, node: BinaryOperationNode, right: SymbolValue) {
  if(node.operator === Tokens.conditional) {
    const rightPointer = castToPointer(file, right).value;
    const nullPointer = getNull(file, right.type);
    // Cast left.value to boolean?
    return {
      type: right.type,
      isPointer: true,
      value: file.builder.CreateSelect(left.value, rightPointer, nullPointer)
    };
  } else {
    return undefined;
  }
}
