import { Token, Tokens } from "../../../../lex";
import { ParseResult, ASTNode } from "../../..";

export const booleanKind = "boolean";

export interface BooleanNode extends ASTNode {
  kind: typeof booleanKind;
  value: boolean;
}

export function parseBoolean(tokens: Token[]): ParseResult<BooleanNode> {
  return {
    tokens: tokens.slice(1),
    node: {
      kind: booleanKind,
      value: tokens[0].type === Tokens.true
    }
  };
}
