import { ParseResult } from "../../../../../..";
import { Token, haveTokens, Tokens } from "../../../../../../../lexer";
import { ASTNode, Kinds } from "../../../../../../node";

export interface FloatNode extends ASTNode {
  kind: Kinds.float;
  value: number;
}

export function parseFloatValue(tokens: Token[]): ParseResult<FloatNode> {
  if(haveTokens(tokens, Tokens.infinity)) {
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


