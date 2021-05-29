import reduceFirst from "reduce-first";
import { ParseResult } from "../../../../..";
import { Token } from "../../../../../../lexer";
import { CallOperationNode, parseCallOperation } from "./call-operation";
import { IndexOperationNode, parseIndexOperation } from "./index-operation";
import { parseValue, ValueNode } from "./value";

export type ValueOperationNode =
  | IndexOperationNode
  | CallOperationNode
  | ValueNode;

const parsers = [
  parseIndexOperation,
  parseCallOperation
];

function parsePostValueOperation(value: ValueNode, tokens: Token[]): ParseResult<ValueOperationNode> {
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

export function parseValueOperation(tokens: Token[]): ParseResult<ValueOperationNode> {
  const valueResult = parseValue(tokens);
  if(valueResult) {
    return parsePostValueOperation(valueResult.node, valueResult.tokens);
  } else {
    return undefined;
  }
}
