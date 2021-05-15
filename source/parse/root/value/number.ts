import { Token, Tokens } from "../../../lex";
import { ParseResult, ASTNode } from "../..";
import { Kinds } from "../../node";

export interface NumberNode extends ASTNode {
  kind: Kinds.number;
  value: number;
}

export function parseNumber(tokens: Token[]): ParseResult<NumberNode> {
  return {
    tokens: tokens.slice(1),
    node: {
      kind: Kinds.number,
      value: tokens[0].type === Tokens.infinity ? Infinity : parseFloat(tokens[0].value)
    }
  };
}
