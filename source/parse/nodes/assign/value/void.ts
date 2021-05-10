import { Token } from "../../../../lex";
import { ParseResult, ASTNode } from "../../..";

export const voidKind = "void";

export interface VoidNode extends ASTNode {
  kind: typeof voidKind;
}

export function parseVoid(tokens: Token[]): ParseResult<VoidNode> {
  return {
    tokens: tokens.slice(1),
    node: {
      kind: voidKind
    }
  };
}
