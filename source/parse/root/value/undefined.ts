import { Token } from "../../../lex";
import { ParseResult, ASTNode } from "../..";

export const undefinedKind = "undefined";

export type UndefinedKind = typeof undefinedKind;

export interface UndefinedNode extends ASTNode {
  kind: UndefinedKind;
  value: undefined;
}

export function parseUndefined(tokens: Token[]): ParseResult<UndefinedNode> {
  return {
    tokens: tokens.slice(1),
    node: {
      kind: undefinedKind,
      value: undefined
    }
  };
}
