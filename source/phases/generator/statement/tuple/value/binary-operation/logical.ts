import { LLVMOperation, matchSignature, OperationOverrides } from ".";
import { Tokens } from "../../../../../scanner";
import { LogicalOperator, BinaryOperationNode, isLogicalOperation } from "../../../../../parser";
import { LLVMFile } from "../../../../file";
import { castToBoolean, getType, Primitives, SymbolValue } from "../../../../types";

const operations: {
  [key in LogicalOperator]: LLVMOperation;
} = {
  [Tokens.logical_and]: "CreateAnd",
  [Tokens.logical_or]: "CreateOr"
};

const overrides: OperationOverrides<LogicalOperator> = [{
  signature: [
    [Primitives.Boolean, Primitives.Int32, Primitives.Float32],
    [Primitives.Boolean, Primitives.Int32, Primitives.Float32]
  ],
  fn: (left: SymbolValue, right: SymbolValue) => (file: LLVMFile, operator: LogicalOperator) => ({
    type: getType(Primitives.Boolean),
    value: file.builder[operations[operator]](
      castToBoolean(file, left).value,
      castToBoolean(file, right).value
    )
  })
}];

export function buildLogicalOperation(file: LLVMFile, left: SymbolValue, node: BinaryOperationNode, right: SymbolValue) {
  if(isLogicalOperation(node)) {
    const override = matchSignature(overrides, [left, right]);
    return override?.(file, node.operator);
  } else {
    return undefined;
  }
}
