import { PotentialParseResult } from "../../..";
import { haveTokens, Token, Tokens } from "../../../../lexer";
import { ASTNode, Kinds } from "../../../node";

export interface FloatNode extends ASTNode {
  kind: Kinds.float;
  value: number;
}

export function parseFloatValue(tokens: Token[]): PotentialParseResult<FloatNode> {
  if(haveTokens(tokens, Tokens.number, Tokens.dot, Tokens.number)) {
    return {
      tokens: tokens.slice(3),
      node: {
        kind: Kinds.float,
        value: parseFloat(`${tokens[0].value}.${tokens[2].value}`)
      }
    };
  } else if(haveTokens(tokens, Tokens.infinity)) {
    return {
      tokens: tokens.slice(1),
      node: {
        kind: Kinds.float,
        value: Infinity
      }
    };
  } else {
    return undefined;
  }
}


