import { ParseResult } from "../";
import { Token } from "../../lex";
import { Kinds } from "../node";

export type InvalidNode = {
  kind: Kinds.invalid;
  value: string;
};

export function parseInvalid(tokens: Token[]): ParseResult<InvalidNode> {
  return {
    tokens: tokens.slice(1),
    node: {
      kind: Kinds.invalid,
      value: tokens[0].value
    }
  };
}
