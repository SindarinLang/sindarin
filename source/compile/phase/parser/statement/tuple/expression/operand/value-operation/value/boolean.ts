import { ParseResult } from "../../../../../..";
import { Token, haveTokens, Tokens } from "../../../../../../../scanner";
import { ASTNode, Kinds } from "../../../../../../node";

export interface BooleanNode extends ASTNode {
  kind: Kinds.boolean;
  value: boolean;
}

export function parseBoolean(tokens: Token[]): ParseResult<BooleanNode> {
  if(haveTokens(tokens, Tokens.true) || haveTokens(tokens, Tokens.false)) {
    return {
      tokens: tokens.slice(1),
      node: {
        kind: Kinds.boolean,
        value: tokens[0].kind === Tokens.true
      }
    };
  } else {
    return undefined;
  }
}
