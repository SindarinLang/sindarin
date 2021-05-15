import { ValueNode, parseValue } from "..";
import { ASTNode, ParseResult } from "../../..";
import { OperatorNode, parseOperator } from "./operator";
import { Token } from "../../../../lex";
import { Kinds } from "../../../node";

export interface ExpressionNode extends ASTNode {
  kind: Kinds.expression;
  value: ValueNode;
  operator: OperatorNode;
}

export function parseExpression(tokens: Token[]): ParseResult<ExpressionNode> {
  const result = parseOperator(tokens.slice(1));
  return {
    tokens: result.tokens,
    node: {
      kind: Kinds.expression,
      value: parseValue([tokens[0]]).node,
      operator: result.node
    }
  };
}
