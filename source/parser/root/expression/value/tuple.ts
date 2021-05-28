import { ValueNode } from ".";
import { parseExpression } from "..";
import { PotentialParseResult } from "../../..";
import { haveTokens, Token, Tokens } from "../../../../lexer";

export function parseTuple(tokens: Token[]): PotentialParseResult<ValueNode> {
  if(haveTokens(tokens, Tokens.open_round)) {
    const result = parseExpression(tokens.slice(1));
    if(haveTokens(result.tokens, Tokens.close_round)) {
      return {
        tokens: result.tokens.slice(1),
        node: result.node
      };
    } else {
      throw new Error("syntax error");
    }
  } else {
    return undefined;
  }
}
