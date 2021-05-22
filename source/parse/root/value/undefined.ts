import { Token } from "../../../lex";
import { ParseResult, ASTNode } from "../..";
import { Kinds } from "../../node";

export interface UndefinedNode extends ASTNode {
  kind: Kinds.undefined;
  value: undefined;
}

export function parseUndefined(tokens: Token[]): ParseResult<UndefinedNode> {
  return {
    tokens: tokens.slice(1),
    node: {
      kind: Kinds.undefined,
      value: undefined
    }
  };
}
