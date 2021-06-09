import { LLVMOperation, matchSignature, OperationOverrides } from ".";
import { Tokens } from "../../../../../scanner";
import { NumericOperator, BinaryOperationNode, isNumericOperation } from "../../../../../parser/statement/tuple/binary-operation";
import { LLVMFile, SymbolValue } from "../../../../file";
import { Types } from "../../../../primitive";
import { castFloat } from "../float";

const overrides: OperationOverrides = [{
  signature: [
    [Types.Int32, Types.Float32],
    [Types.Int32, Types.Float32]
  ],
  fn: (file: LLVMFile, left: SymbolValue, operation: LLVMOperation, right: SymbolValue) => ({
    type: Types.Float32,
    value: file.builder[operation](
      castFloat(file, left),
      castFloat(file, right)
    )
  })
}];

const operations: {
  [key in NumericOperator]: LLVMOperation;
} = {
  [Tokens.add]: "CreateFAdd",
  [Tokens.subtract]: "CreateFSub",
  [Tokens.multiply]: "CreateFMul",
  [Tokens.modulus]: "CreateFRem",
  [Tokens.divide]: "CreateFDiv"
};

export function buildFloatOperation(file: LLVMFile, left: SymbolValue, node: BinaryOperationNode, right: SymbolValue) {
  if(isNumericOperation(node)) {
    const override = matchSignature(overrides, [left, right]);
    return override(file, left, operations[node.operator], right);
  } else {
    return undefined;
  }
}
