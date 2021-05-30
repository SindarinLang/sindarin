import { Tokens } from "../../../lexer";
import { isNode, Kinds } from "../../../parser/node";
import { UnaryOperator, UnaryOperationNode } from "../../../parser/statement/tuple/expression/operand/unary-operation";
import { LLVMFile, SymbolValue } from "../../file";
import { matchSignature, Overrides, primitives } from "../../primitive";
import { getBoolean, castBoolean } from "./boolean";
import { getFloat } from "./float";
import { getInteger } from "./integer";
import { buildValue } from "./";

const notOverrides: Overrides = [{
  signature: [
    [primitives.int1, primitives.int32, primitives.float]
  ],
  function: (file: LLVMFile, right: SymbolValue) => ({
    type: primitives.int1,
    value: file.builder.CreateICmpEQ(
      getBoolean(file, false),
      castBoolean(file, right)
    )
  })
}];

const negativeOverrides: Overrides = [{
  signature: [
    [primitives.int32]
  ],
  function: (file: LLVMFile, right: SymbolValue) => ({
    type: primitives.int32,
    value: file.builder.CreateMul(
      getInteger(file, -1),
      right.value
    )
  })
}, {
  signature: [
    [primitives.float]
  ],
  function: (file: LLVMFile, right: SymbolValue) => ({
    type: primitives.float,
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
