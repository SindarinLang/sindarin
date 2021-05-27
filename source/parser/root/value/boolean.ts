import { Token, Tokens } from "../../../lexer";
import { ParseResult, ASTNode } from "../..";
import { Kinds } from "../../node";

export interface BooleanNode extends ASTNode {
  kind: Kinds.boolean;
  value: boolean;
}

export function parseBoolean(tokens: Token[]): ParseResult<BooleanNode> {
  return {
    tokens: tokens.slice(1),
    node: {
      kind: Kinds.boolean,
      value: tokens[0].type === Tokens.true
    }
  };
}
