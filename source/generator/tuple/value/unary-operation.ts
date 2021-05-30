import { Tokens } from "../../../lexer";
import { isNode, Kinds } from "../../../parser/node";
import { UnaryOperator, UnaryOperationNode } from "../../../parser/statement/tuple/expression/operand/unary-operation";
import { LLVMFile, SymbolValue } from "../../file";
import { getBoolean, castBoolean } from "./boolean";
import { getFloat } from "./float";
import { getInteger } from "./integer";
import { buildValue } from "./";
import { Types } from "../../primitive";
import { matchSignature, Overrides } from "../../function";

const notOverrides: Overrides = [{
  signature: [
    [Types.Boolean, Types.Int32, Types.Float32]
  ],
  function: (file: LLVMFile, right: SymbolValue) => ({
    type: Types.Boolean,
    value: file.builder.CreateICmpEQ(
      getBoolean(file, false),
      castBoolean(file, right)
    )
  })
}];

const negativeOverrides: Overrides = [{
  signature: [
    [Types.Int32]
  ],
  function: (file: LLVMFile, right: SymbolValue) => ({
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
  function: (file: LLVMFile, right: SymbolValue) => ({
    type: Types.Float32,
    value: file.builder.CreateFMul(
      getFloat(file, -1),
      right.value
    )
  })
}];

const operators: {
  [key in UnaryOperator]: Overrides;
} = {
  [Tokens.not]: notOverrides,
  [Tokens.subtract]: negativeOverrides,
  [Tokens.destruct]: []
};

export function buildUnaryOperation(file: LLVMFile, node: UnaryOperationNode) {
  const right = buildValue(file, node.right);
  if(isNode(node, Kinds.unaryOperation)) {
    const override = matchSignature(operators[node.operator], [right.type]);
    return override(file, right);
  } else {
    return undefined;
  }
}
