import { Token, Tokens } from "../../../lex";
import { ParseResult, ASTNode } from "../..";

export const numberKind = "number";

export type NumberKind = typeof numberKind;

export interface NumberNode extends ASTNode {
  kind: NumberKind;
  value: number;
}

export function parseNumber(tokens: Token[]): ParseResult<NumberNode> {
  return {
    tokens: tokens.slice(1),
    node: {
      kind: numberKind,
      value: tokens[0].type === Tokens.infinity ? Infinity : parseFloat(tokens[0].value)
    }
  };
}
