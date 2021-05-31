import { Tokens } from "../../../../lexer";
import { isNode, Kinds } from "../../../../parser/node";
import { UnaryOperator, UnaryOperationNode } from "../../../../parser/statement/tuple/expression/operand/unary-operation";
import { LLVMFile, SymbolValue } from "../../../file";
import { getBoolean, castBoolean } from "./boolean";
import { getFloat } from "./float";
import { getInteger } from "./integer";
import { buildValue } from ".";
import { OperationOverrides, matchSignature } from "./binary-operation";
import { Types } from "../../../primitive";

const notOverrides: OperationOverrides = [{
  signature: [
    [Types.Boolean, Types.Int32, Types.Float32]
  ],
  fn: (file: LLVMFile, right: SymbolValue) => ({
    type: Types.Boolean,
    value: file.builder.CreateICmpEQ(
      getBoolean(file, false),
      castBoolean(file, right)
    )
  })
}];

const negativeOverrides: OperationOverrides = [{
  signature: [
    [Types.Int32]
  ],
  fn: (file: LLVMFile, right: SymbolValue) => ({
    type: Types.Int32,
    value: file.builder.CreateMul(
      getInteger(file, -1),
      right.value
    )
  })
}, {
  signature: [
    [Types.Float32]
  ],
  fn: (file: LLVMFile, right: SymbolValue) => ({
    type: Types.Float32,
    value: file.builder.CreateFMul(
      getFloat(file, -1),
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

export function buildUnaryOperation(file: LLVMFile, node: UnaryOperationNode) {
  const right = buildValue(file, node.right);
  if(isNode(node, Kinds.unaryOperation)) {
    const override = matchSignature(operators[node.operator], [right]);
    return override(file, right);
  } else {
    return undefined;
  }
}
