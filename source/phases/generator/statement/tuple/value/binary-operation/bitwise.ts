import { Tokens } from "../../../../../scanner";
import { BitwiseOperator, BinaryOperationNode, isBitwiseOperation } from "../../../../../parser";
import { LLVMFile } from "../../../../file";
import { getType, Primitives, SymbolValue } from "../../../../types";
import { LLVMOperation, matchSignature, OperationOverrides } from ".";

const operations: {
  [key in BitwiseOperator]: LLVMOperation;
} = {
  [Tokens.bitwise_and]: "CreateAnd",
  [Tokens.bitwise_or]: "CreateOr"
};

const overrides: OperationOverrides<BitwiseOperator> = [{
  fn: (left: SymbolValue, right: SymbolValue) => (file: LLVMFile, operator: BitwiseOperator) => ({
    type: getType(Primitives.Boolean),
    value: file.builder[operations[operator]](left.value, right.value)
  }),
  signature: [
    [Primitives.Boolean],
    [Primitives.Boolean]
  ]
}, {
  fn: (left: SymbolValue, right: SymbolValue) => (file: LLVMFile, operator: BitwiseOperator) => ({
    type: getType(Primitives.Int32),
    value: file.builder[operations[operator]](left.value, right.value)
  }),
  signature: [
    [Primitives.Int32],
    [Primitives.Int32]
  ]
}];

export function buildBitwiseOperation(file: LLVMFile, left: SymbolValue[], node: BinaryOperationNode, right: SymbolValue[]): SymbolValue | undefined {
  if(isBitwiseOperation(node)) {
    const override = matchSignature(overrides, [left, right]);
    return override?.(file, node.operator);
  } else {
    return undefined;
  }
}
