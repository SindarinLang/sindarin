import { ParseResult } from "../..";
import { haveTokens, Token, Tokens } from "../../../lexer";
import { ASTNode, Kinds } from "../../node";

export interface VoidNode extends ASTNode {
  kind: Kinds.void;
}

export function parseVoid(tokens: Token[]): ParseResult<VoidNode> {
  if(haveTokens(tokens, Tokens.comma)) {
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
