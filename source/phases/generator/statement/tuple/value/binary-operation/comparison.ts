import { LLVMOperation, matchSignature, OperationOverrides } from ".";
import { Tokens } from "../../../../../scanner";
import { ComparisonOperator, BinaryOperationNode, isComparisonOperation } from "../../../../../parser/statement/tuple/binary-operation";
import { LLVMFile } from "../../../../file";
import { castToFloat32, Primitives, SymbolValue } from "../../../../types";

const signedIntegerOperations: {
  [key in ComparisonOperator]: LLVMOperation;
} = {
  [Tokens.equals]: "CreateICmpEQ",
  [Tokens.less_than]: "CreateICmpSLT",
  [Tokens.greater_than]: "CreateICmpSGT",
  [Tokens.less_than_equals]: "CreateICmpSLE",
  [Tokens.greater_than_equals]: "CreateICmpSGE",
  [Tokens.not_equals]: "CreateICmpNE"
};

const unsignedIntegerOperations: {
  [key in ComparisonOperator]: LLVMOperation;
} = {
  [Tokens.equals]: "CreateICmpEQ",
  [Tokens.less_than]: "CreateICmpULT",
  [Tokens.greater_than]: "CreateICmpUGT",
  [Tokens.less_than_equals]: "CreateICmpULE",
  [Tokens.greater_than_equals]: "CreateICmpUGE",
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

const type = {
  primitive: Primitives.Boolean,
  isPointer: false,
  isOptional: false
};

const overrides: OperationOverrides<ComparisonOperator> = [{
  signature: [
    [Primitives.Boolean],
    [Primitives.Boolean]
  ],
  fn: (left: SymbolValue, right: SymbolValue) => (file: LLVMFile, operator: ComparisonOperator) => ({
    type,
    value: file.builder[unsignedIntegerOperations[operator]](left.value, right.value)
  })
}, {
  signature: [
    [Primitives.Int32],
    [Primitives.Int32]
  ],
  fn: (left: SymbolValue, right: SymbolValue) => (file: LLVMFile, operator: ComparisonOperator) => ({
    type,
    value: file.builder[signedIntegerOperations[operator]](left.value, right.value)
  })
}, {
  signature: [
    [Primitives.Boolean, Primitives.Int32, Primitives.Float32],
    [Primitives.Boolean, Primitives.Int32, Primitives.Float32]
  ],
  fn: (left: SymbolValue, right: SymbolValue) => (file: LLVMFile, operator: ComparisonOperator) => ({
    type,
    value: file.builder[floatOperations[operator]](
      castToFloat32(file, left).value,
      castToFloat32(file, right).value
    )
  })
}];

export function buildComparisonOperation(file: LLVMFile, left: SymbolValue[], node: BinaryOperationNode, right: SymbolValue[]) {
  if(isComparisonOperation(node)) {
    const override = matchSignature(overrides, [left, right]);
    return override?.(file, node.operator);
  } else {
    return undefined;
  }
}
