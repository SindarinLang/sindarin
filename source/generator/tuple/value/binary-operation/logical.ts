import { LLVMOperation, matchSignature, OperationOverrides } from ".";
import { Tokens } from "../../../../lexer";
import { LogicalOperator, BinaryOperationNode, isLogicalOperation } from "../../../../parser/statement/tuple/expression/binary-operation";
import { LLVMFile, SymbolValue } from "../../../file";
import { Types } from "../../../primitive";
import { castBoolean } from "../boolean";

const overrides: OperationOverrides = [{
  signature: [
    [Types.Boolean, Types.Int32, Types.Float32],
    [Types.Boolean, Types.Int32, Types.Float32]
  ],
  fn: (file: LLVMFile, left: SymbolValue, operation: LLVMOperation, right: SymbolValue) => ({
    type: Types.Boolean,
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
    const override = matchSignature(overrides, [left, right]);
    return override(file, left, operations[node.operator], right);
  } else {
    return undefined;
  }
}
