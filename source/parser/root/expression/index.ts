import { Token, Tokens } from "../../../lexer";
import { ParseResult } from "../..";
import { isOperator, OperatorNode, parseOperator } from "./operator";

function isEnd(tokens: Token[]) {
  return tokens[0].type === Tokens.semi || tokens[0].type === Tokens.close_round || tokens[0].type === Tokens.close_square;
}

export function parseExpression(tokens: Token[]): ParseResult<ValueNode> {
  let result = parseValue(tokens);
  while(!isEnd(result.tokens)) {
    if(isOperator(result.tokens[0].type)) {
      result = parseOperator(result.node, result.tokens);
    } else {
      throw new Error("Syntax error");
    }
  }
  return result;
}
