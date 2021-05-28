import { PotentialParseResult } from "../../..";
import { haveTokens, Token, Tokens } from "../../../../lexer";
import { ASTNode, Kinds } from "../../../node";

export interface NullNode extends ASTNode {
  kind: Kinds.null;
  value: null;
}

export function parseNull(tokens: Token[]): PotentialParseResult<NullNode> {
  if(haveTokens(tokens, Tokens.null)) {
    return {
      tokens: tokens.slice(1),
      node: {
        kind: Kinds.null,
        value: null
      }
    };
  } else {
    return undefined;
  }
}
