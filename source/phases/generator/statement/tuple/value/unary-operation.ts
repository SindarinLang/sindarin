import { Tokens } from "../../../../scanner";
import { UnaryOperationNode, UnaryOperator } from "../../../../parser";
import { LLVMFile } from "../../../file";
import { buildValue } from ".";
import { Primitives, SymbolValue, getBooleanValue, castToBoolean, getInt32Value, getFloat32Value, LLVMValue, getType } from "../../../types";
import { ConditionalKeys } from "../../../../../utils";

export type LLVMOperation = ConditionalKeys<llvm.IRBuilder, ((lhs: LLVMValue, rhs: LLVMValue, name?: string) => LLVMValue)>;

type OperationOverride = {
  fn: (right: SymbolValue) => (file: LLVMFile) => SymbolValue;
  signature: Primitives[][];
};

export type OperationOverrides = OperationOverride[];

export function matchSignature(overrides: OperationOverrides, signature: SymbolValue[]) {
  return overrides.find((override) => {
    return override.signature.reduce((retval, arg, index) => {
      // TODO: search over signature
      const type = signature[index].type.primitive;
      return retval && typeof type === "string" && arg.includes(type);
    }, true as boolean);
  })?.fn(signature[0]);
}

const notOverrides: OperationOverrides = [{
  signature: [
    [Primitives.Boolean, Primitives.Int32, Primitives.Float32]
  ],
  fn: (right: SymbolValue) => (file: LLVMFile) => ({
    type: getType(Primitives.Boolean),
    value: file.builder.CreateICmpEQ(
      getBooleanValue(file, false),
      castToBoolean(file, right).value
    )
  })
}];

const negativeOverrides: OperationOverrides = [{
  signature: [
    [Primitives.Int32]
  ],
  fn: (right: SymbolValue) => (file: LLVMFile) => ({
    type: getType(Primitives.Int32),
    value: file.builder.CreateMul(
      getInt32Value(file, -1),
      right.value
    )
  })
}, {
  signature: [
    [Primitives.Float32]
  ],
  fn: (right: SymbolValue) => (file: LLVMFile) => ({
    type: getType(Primitives.Float32),
    value: file.builder.CreateFMul(
      getFloat32Value(file, -1),
      right.value
    )
  })
}];

const operators: {
  [key in UnaryOperator]: OperationOverrides;
} = {
  [Tokens.not]: notOverrides,
  [Tokens.subtract]: negativeOverrides,
  [Tokens.destruct]: []
};

export function buildUnaryOperation(file: LLVMFile, node: UnaryOperationNode): SymbolValue {
  const right = buildValue(file, node.right);
  const override = matchSignature(operators[node.operator], [right]);
  const result = override?.(file);
  if(result) {
    return result;
  } else {
    throw new Error("Cannot build unary operation");
  }
}
