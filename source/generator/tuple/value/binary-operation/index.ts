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
import { Types, Primitive, getLLVMType } from "../../../primitive";

type OperationOverride<T = any> = {
  fn: T;
  signature: Types[][];
};

export type OperationOverrides<T = any> = OperationOverride<T>[];

export function getSignature(symbols: SymbolValue[]) {
  return symbols.map((symbol) => symbol.type);
}

export function getLLVMSignature(file: LLVMFile, argumentTypes: Primitive[]) {
  return argumentTypes.map((type) => getLLVMType(file, type));
}

export function matchSignature<T = any>(overrides: OperationOverrides<T>, signature: Primitive[]) {
  return overrides.find((override) => {
    return override.signature.reduce((retval, arg, index) => {
      return retval && arg.includes(signature[index].type);
    }, true as boolean);
  })?.fn;
}

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
