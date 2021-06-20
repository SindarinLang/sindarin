import llvm from "llvm-bindings";
import reduceFirst from "reduce-first";
import { ConditionalKeys } from "../../../../../../utils";
import { BinaryOperationNode, BinaryOperator } from "../../../../../parser";
import { LLVMFile } from "../../../../file";
import { LLVMValue, Primitives, SymbolValue } from "../../../../types";
import { buildValue } from "..";
import { buildBitwiseOperation } from "./bitwise";
import { buildLogicalOperation } from "./logical";
import { buildComparisonOperation } from "./comparison";
import { buildIntegerOperation } from "./integer";
import { buildFloatOperation } from "./float";
import { buildConditionalOperation } from "./conditional";
import { buildDefaultOperation } from "./default";

export type LLVMOperation = ConditionalKeys<llvm.IRBuilder, ((lhs: LLVMValue, rhs: LLVMValue, name?: string) => LLVMValue)>;

type OperationOverride<T extends BinaryOperator> = {
  fn: (left: SymbolValue, right: SymbolValue) => (file: LLVMFile, operator: T) => SymbolValue;
  signature: Primitives[][];
};

export type OperationOverrides<T extends BinaryOperator> = OperationOverride<T>[];

export function getSignature(symbols: SymbolValue[]) {
  return symbols.map((symbol) => symbol.type);
}

export function matchSignature<T extends BinaryOperator>(overrides: OperationOverrides<T>, signature: SymbolValue[]) {
  return overrides.find((override) => {
    return override.signature.reduce((retval, arg, index) => {
      // TODO: search over signature
      const type = signature[index].type.primitive;
      return retval && typeof type === "string" && arg.includes(type);
    }, true as boolean);
  })?.fn(signature[0], signature[1]);
}

type Builder = (file: LLVMFile, left: SymbolValue, operation: BinaryOperationNode, right: SymbolValue) => SymbolValue | undefined;

const builders: Builder[] = [
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
  const result = reduceFirst(builders, (builder) => {
    return builder(file, leftValue, node, rightValue);
  });
  if(result === undefined) {
    throw new Error("Cannot build binary operation");
  } else {
    return result;
  }
}
