import { ParseResult } from ".";
import { haveTokens, Token, Tokens } from "../lexer";
import { ASTNode, Kinds } from "./node";

export interface SpreadNode extends ASTNode {
  kind: Kinds.spread;
}

export function parseSpread(tokens: Token[]): ParseResult<SpreadNode> {
  if(haveTokens(tokens, Tokens.destruct)) {
    return {
      tokens: tokens.slice(1),
      node: {
        kind: Kinds.spread
      }
    };
  } else {
    return undefined;
  }
}
