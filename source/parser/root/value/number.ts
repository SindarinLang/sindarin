import { Token, Tokens } from "../../../lexer";
import { ParseResult, ASTNode } from "../..";
import { Kinds } from "../../node";

export interface IntegerNode extends ASTNode {
  kind: Kinds.integer;
  value: number;
}

export interface FloatNode extends ASTNode {
  kind: Kinds.float;
  value: number;
}

export function parseFloatValue(tokens: Token[]): ParseResult<FloatNode> {
  return {
    tokens: tokens.slice(1),
    node: {
      kind: Kinds.float,
      value: tokens[0].type === Tokens.infinity ? Infinity : parseFloat(tokens[0].value)
    }
  };
}

export function parseIntegerValue(tokens: Token[]): ParseResult<IntegerNode> {
  return {
    tokens: tokens.slice(1),
    node: {
      kind: Kinds.integer,
      value: parseInt(tokens[0].value)
    }
  };
}
