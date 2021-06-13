import { LLVMOperation, matchSignature, OperationOverrides } from ".";
import { Tokens } from "../../../../../scanner";
import { NumericOperator, BinaryOperationNode, isNumericOperation } from "../../../../../parser/statement/tuple/binary-operation";
import { LLVMFile } from "../../../../file";
import { castToFloat32, getType, Primitives, SymbolValue } from "../../../../types";

const operations: {
  [key in NumericOperator]: LLVMOperation;
} = {
  [Tokens.add]: "CreateFAdd",
  [Tokens.subtract]: "CreateFSub",
  [Tokens.multiply]: "CreateFMul",
  [Tokens.modulus]: "CreateFRem",
  [Tokens.divide]: "CreateFDiv"
};

const overrides: OperationOverrides<NumericOperator> = [{
  signature: [
    [Primitives.Int32, Primitives.Float32],
    [Primitives.Int32, Primitives.Float32]
  ],
  fn: (left: SymbolValue, right: SymbolValue) => (file: LLVMFile, operator: NumericOperator) => ({
    type: getType(Primitives.Float32),
    value: file.builder[operations[operator]](
      castToFloat32(file, left).value,
      castToFloat32(file, right).value
    )
  })
}];

export function buildFloatOperation(file: LLVMFile, left: SymbolValue[], node: BinaryOperationNode, right: SymbolValue[]) {
  if(isNumericOperation(node)) {
    const override = matchSignature(overrides, [left, right]);
    return override?.(file, node.operator);
  } else {
    return undefined;
  }
}
