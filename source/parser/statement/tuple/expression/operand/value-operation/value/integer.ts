import { ParseResult } from "../../../../../..";
import { Token, haveTokens, Tokens } from "../../../../../../../lexer";
import { ASTNode, Kinds } from "../../../../../../node";

export interface IntegerNode extends ASTNode {
  kind: Kinds.integer;
  value: number;
}

export function parseIntegerValue(tokens: Token[]): ParseResult<IntegerNode> {
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
