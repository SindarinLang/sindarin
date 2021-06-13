import { LLVMOperation, matchSignature, OperationOverrides } from ".";
import { Tokens } from "../../../../../scanner";
import { IntegerOperator, BinaryOperationNode, isIntegerOperation } from "../../../../../parser/statement/tuple/binary-operation";
import { LLVMFile } from "../../../../file";
import { getType, Primitives, SymbolValue } from "../../../../types";

const operations: {
  [key in IntegerOperator]: LLVMOperation;
} = {
  [Tokens.add]: "CreateAdd",
  [Tokens.subtract]: "CreateSub",
  [Tokens.multiply]: "CreateMul",
  [Tokens.modulus]: "CreateSRem"
};

const overrides: OperationOverrides<IntegerOperator> = [{
  signature: [
    [Primitives.Int32],
    [Primitives.Int32]
  ],
  fn: (left: SymbolValue, right: SymbolValue) => (file: LLVMFile, operator: IntegerOperator) => ({
    type: getType(Primitives.Int32),
    value: file.builder[operations[operator]](left.value, right.value)
  })
}];

export function buildIntegerOperation(file: LLVMFile, left: SymbolValue[], node: BinaryOperationNode, right: SymbolValue[]) {
  if(isIntegerOperation(node)) {
    const override = matchSignature(overrides, [left, right]);
    return override?.(file, node.operator);
  } else {
    return undefined;
  }
}
