import { Token } from "../../../../lexer";
import { ParseResult, ASTNode } from "../../..";
import { Kinds } from "../../../node";

export interface VoidNode extends ASTNode {
  kind: Kinds.void;
}

export function parseVoid(tokens: Token[]): ParseResult<VoidNode> {
  return {
    tokens: tokens.slice(1),
    node: {
      kind: Kinds.void
    }
  };
}
