import { LLVMOperation } from ".";
import { Tokens } from "../../../../lexer";
import { LogicalOperator, BinaryOperationNode, isLogicalOperation } from "../../../../parser/statement/tuple/expression/binary-operation";
import { LLVMFile, SymbolValue } from "../../../file";
import { matchSignature, Overrides, primitives } from "../../../primitive";
import { castBoolean } from "../boolean";

const overrides: Overrides = [{
  signature: [
    [primitives.int1, primitives.int32, primitives.float],
    [primitives.int1, primitives.int32, primitives.float]
  ],
  function: (file: LLVMFile, left: SymbolValue, operation: LLVMOperation, right: SymbolValue) => ({
    type: primitives.int1,
    value: file.builder[operation](
      castBoolean(file, left),
      castBoolean(file, right)
    )
  })
}];

const operations: {
  [key in LogicalOperator]: LLVMOperation;
} = {
  [Tokens.logical_and]: "CreateAnd",
  [Tokens.logical_or]: "CreateOr"
};

export function buildLogicalOperation(file: LLVMFile, left: SymbolValue, node: BinaryOperationNode, right: SymbolValue) {
  if(isLogicalOperation(node)) {
    const override = matchSignature(overrides, [left.type, right.type]);
    return override(file, left, operations[node.operator], right);
  } else {
    return undefined;
  }
}
