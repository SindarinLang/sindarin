import { LLVMOperation, matchSignature, OperationOverrides } from ".";
import { Tokens } from "../../../../../lexer";
import { BitwiseOperator, BinaryOperationNode, isBitwiseOperation } from "../../../../../parser/statement/tuple/expression/binary-operation";
import { LLVMFile, SymbolValue } from "../../../../file";
import { Types } from "../../../../primitive";

const overrides: OperationOverrides = [{
  fn: buildBooleanBitwiseOperation,
  signature: [
    [Types.Boolean],
    [Types.Boolean]
  ]
}, {
  fn: buildIntegerBitwiseOperation,
  signature: [
    [Types.Int32],
    [Types.Int32]
  ]
}];

const operations: {
  [key in BitwiseOperator]: LLVMOperation;
} = {
  [Tokens.bitwise_and]: "CreateAnd",
  [Tokens.bitwise_or]: "CreateOr"
};

function buildBooleanBitwiseOperation(file: LLVMFile, left: SymbolValue, operation: LLVMOperation, right: SymbolValue) {
  return {
    type: Types.Boolean,
    value: file.builder[operation](left.value, right.value)
  };
}

function buildIntegerBitwiseOperation(file: LLVMFile, left: SymbolValue, operation: LLVMOperation, right: SymbolValue) {
  return {
    type: Types.Int32,
    value: file.builder[operation](left.value, right.value)
  };
}

export function buildBitwiseOperation(file: LLVMFile, left: SymbolValue, node: BinaryOperationNode, right: SymbolValue) {
  if(isBitwiseOperation(node)) {
    const override = matchSignature(overrides, [left, right]);
    return override(file, left, operations[node.operator], right);
  } else {
    return undefined;
  }
}
