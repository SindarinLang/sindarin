import { ParseResult } from "../..";
import { haveTokensIn, Token, Tokens } from "../../../lexer";
import { ASTNode, Kinds } from "../../node";

export interface VoidNode extends ASTNode {
  kind: Kinds.void;
}

export function parseVoid(tokens: Token[]): ParseResult<VoidNode> {
  if(haveTokensIn(tokens, [Tokens.comma, Tokens.close_round])) {
    return {
      tokens,
      node: {
        kind: Kinds.void
      }
    };
  } else {
    return undefined;
  }
}
