import llvm from "llvm-bindings";
import { buildBitwiseOperation } from "./bitwise";
import { buildLogicalOperation } from "./logical";
import { buildComparisonOperation } from "./comparison";
import { buildIntegerOperation } from "./integer";
import { buildFloatOperation } from "./float";
import reduceFirst from "reduce-first";
import { BinaryOperationNode } from "../../../../parser/statement/tuple/expression/binary-operation";
import { ConditionalKeys } from "../../../../utils";
import { LLVMFile, SymbolValue } from "../../../file";
import { buildValue } from "..";
import { buildConditionalOperation } from "./conditional";
import { buildDefaultOperation } from "./default";

export type LLVMOperation = ConditionalKeys<llvm.IRBuilder, ((lhs: llvm.Value, rhs: llvm.Value, name?: string) => llvm.Value)>;

const builders = [
  buildBitwiseOperation,
  buildLogicalOperation,
  buildComparisonOperation,
  buildIntegerOperation,
  buildFloatOperation,
  buildConditionalOperation,
  buildDefaultOperation
];

export function buildBinaryOperation(file: LLVMFile, node: BinaryOperationNode): SymbolValue {
  const leftValue = buildValue(file, node.left);
  const rightValue = buildValue(file, node.right);
  return reduceFirst(builders, (builder) => {
    return builder(file, leftValue, node, rightValue);
  });
}
