import { ParseResult } from "../../../../../..";
import { Token, haveTokens, Tokens } from "../../../../../../../scanner";
import { ASTNode, Kinds } from "../../../../../../node";

export interface NullNode extends ASTNode {
  kind: Kinds.null;
  value: null;
}

export function parseNull(tokens: Token[]): ParseResult<NullNode> {
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
