import reduceFirst from "reduce-first";
import { ExpressionNode } from "../..";
import { ParseResult } from "../../../../..";
import { Token } from "../../../../../../scanner";
import { AccessorNode, parseAccessor } from "./accessor";
import { CallNode, parseCall } from "./call";
import { parseValue, ValueNode } from "./value";

export type ValueOperationNode =
  | ValueNode
  | AccessorNode
  | CallNode;

const parsers = [
  parseAccessor,
  parseCall
];

function parsePostValueOperation(value: ExpressionNode, tokens: Token[]): ParseResult<ValueOperationNode | ExpressionNode> {
  const operationResult = reduceFirst(parsers, (parser) => {
    return parser(value, tokens);
  });
  if(operationResult) {
    return parsePostValueOperation(operationResult.node, operationResult.tokens);
  } else {
    return {
      tokens,
      node: value
    };
  }
}

export function parseValueOperation(tokens: Token[]): ParseResult<ValueOperationNode | ExpressionNode> {
  const valueResult = parseValue(tokens);
  if(valueResult) {
    return parsePostValueOperation(valueResult.node, valueResult.tokens);
  } else {
    return undefined;
  }
}
