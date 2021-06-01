import { LLVMOperation, matchSignature, OperationOverrides } from ".";
import { Tokens } from "../../../../../scanner";
import { ComparisonOperator, BinaryOperationNode, isComparisonOperation } from "../../../../../parser/statement/tuple/expression/binary-operation";
import { LLVMFile, SymbolValue } from "../../../../file";
import { Types } from "../../../../primitive";
import { castFloat } from "../float";

const integerOperations: {
  [key in ComparisonOperator]: LLVMOperation;
} = {
  [Tokens.equals]: "CreateICmpEQ",
  [Tokens.less_than]: "CreateICmpSLT",
  [Tokens.greater_than]: "CreateICmpSGT",
  [Tokens.less_than_equals]: "CreateICmpSLE",
  [Tokens.greater_than_equals]: "CreateICmpSGE",
  [Tokens.not_equals]: "CreateICmpNE"
};

const floatOperations: {
  [key in ComparisonOperator]: LLVMOperation;
} = {
  [Tokens.equals]: "CreateFCmpOEQ",
  [Tokens.less_than]: "CreateFCmpOLT",
  [Tokens.greater_than]: "CreateFCmpOGT",
  [Tokens.less_than_equals]: "CreateFCmpOLE",
  [Tokens.greater_than_equals]: "CreateFCmpOGE",
  [Tokens.not_equals]: "CreateFCmpONE"
};

const overrides: OperationOverrides = [{
  signature: [
    [Types.Int32],
    [Types.Int32]
  ],
  fn: (file: LLVMFile, left: SymbolValue, operator: ComparisonOperator, right: SymbolValue) => ({
    type: Types.Int32,
    value: file.builder[integerOperations[operator]](left.value, right.value)
  })
}, {
  signature: [
    [Types.Int32, Types.Float32],
    [Types.Int32, Types.Float32]
  ],
  fn: (file: LLVMFile, left: SymbolValue, operator: ComparisonOperator, right: SymbolValue) => ({
    type: Types.Float32,
    value: file.builder[floatOperations[operator]](
      castFloat(file, left),
      castFloat(file, right)
    )
  })
}];

export function buildComparisonOperation(file: LLVMFile, left: SymbolValue, node: BinaryOperationNode, right: SymbolValue) {
  if(isComparisonOperation(node)) {
    const override = matchSignature(overrides, [left, right]);
    return override(file, left, node.operator, right);
  } else {
    return undefined;
  }
}
