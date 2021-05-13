import { Token } from "../../../lex";
import { ParseResult, ASTNode } from "../..";

export const voidKind = "void";

export type VoidKind = typeof voidKind;

export interface VoidNode extends ASTNode {
  kind: VoidKind;
}

export function parseVoid(tokens: Token[]): ParseResult<VoidNode> {
  return {
    tokens: tokens.slice(1),
    node: {
      kind: voidKind
    }
  };
}
