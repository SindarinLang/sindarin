import { ValueNode, parseValue } from "..";
import { ASTNode, ParseResult } from "../../..";
import { OperatorNode, parseOperator } from "./operator";
import { Token } from "../../../../lex";

export const expressionKind = "expression";

export type ExpressionKind = typeof expressionKind;

export interface ExpressionNode extends ASTNode {
  kind: ExpressionKind;
  value: ValueNode;
  operator: OperatorNode;
}

export function parseExpression(tokens: Token[]): ParseResult<ExpressionNode> {
  const result = parseOperator(tokens.slice(1));
  return {
    tokens: result.tokens,
    node: {
      kind: expressionKind,
      value: parseValue([tokens[0]]).node,
      operator: result.node
    }
  };
}
