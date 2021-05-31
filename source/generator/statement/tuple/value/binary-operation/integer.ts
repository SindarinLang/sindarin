import { LLVMOperation, matchSignature, OperationOverrides } from ".";
import { Tokens } from "../../../../../lexer";
import { IntegerOperator, BinaryOperationNode, isIntegerOperation } from "../../../../../parser/statement/tuple/expression/binary-operation";
import { LLVMFile, SymbolValue } from "../../../../file";
import { Types } from "../../../../primitive";

const overrides: OperationOverrides = [{
  signature: [
    [Types.Int32],
    [Types.Int32]
  ],
  fn: (file: LLVMFile, left: SymbolValue, operation: LLVMOperation, right: SymbolValue) => ({
    primitive: Types.Int32,
    value: file.builder[operation](left.value, right.value)
  })
}];

const operations: {
  [key in IntegerOperator]: LLVMOperation;
} = {
  [Tokens.add]: "CreateAdd",
  [Tokens.subtract]: "CreateSub",
  [Tokens.multiply]: "CreateMul",
  [Tokens.modulus]: "CreateSRem"
};

export function buildIntegerOperation(file: LLVMFile, left: SymbolValue, node: BinaryOperationNode, right: SymbolValue) {
  if(isIntegerOperation(node)) {
    const override = matchSignature(overrides, [left, right]);
    return override(file, left, operations[node.operator], right);
  } else {
    return undefined;
  }
}
