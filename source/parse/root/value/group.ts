import { Token, Tokens } from "../../../lex";
import { ParseResult } from "../..";
import { parseExpression, ValueNode } from ".";

export function parseGroup(tokens: Token[]): ParseResult<ValueNode> {
  const result = parseExpression(tokens.slice(1));
  if(result.tokens[0].type === Tokens.close_paren) {
    return {
      tokens: result.tokens.slice(1),
      node: result.node
    };
  } else {
    throw new Error("syntax error");
  }
}
