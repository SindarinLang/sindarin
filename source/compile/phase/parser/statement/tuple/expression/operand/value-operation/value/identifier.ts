import { ParseResult } from "../../../../../..";
import { Token, haveTokens, Tokens } from "../../../../../../../scanner";
import { ASTNode, Kinds } from "../../../../../../node";

export interface IdentifierNode extends ASTNode {
  kind: Kinds.identifier;
  value: string;
}

export function parseIdentifier(tokens: Token[]): ParseResult<IdentifierNode> {
  if(haveTokens(tokens, Tokens.identifier)) {
    return {
      tokens: tokens.slice(1),
      node: {
        kind: Kinds.identifier,
        value: tokens[0].value
      }
    };
  } else {
    return undefined;
  }
}
