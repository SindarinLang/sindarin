import { PotentialParseResult } from "../../..";
import { haveTokens, Token, Tokens } from "../../../../lexer";
import { ASTNode, Kinds } from "../../../node";

export interface IntegerNode extends ASTNode {
  kind: Kinds.integer;
  value: number;
}

export function parseIntegerValue(tokens: Token[]): PotentialParseResult<IntegerNode> {
  if(haveTokens(tokens, Tokens.number)) {
    return {
      tokens: tokens.slice(1),
      node: {
        kind: Kinds.integer,
        value: parseInt(tokens[0].value)
      }
    };
  } else {
    return undefined;
  }
}
