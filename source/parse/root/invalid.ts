import { ParseResult } from "../";
import { Token } from "../../lex";

const invalidKind = "invalid";

export type InvalidKind = typeof invalidKind;

export type InvalidNode = {
  kind: InvalidKind;
  value: string;
};

export function parseInvalid(tokens: Token[]): ParseResult<InvalidNode> {
  return {
    tokens: tokens.slice(1),
    node: {
      kind: invalidKind,
      value: tokens[0].value
    }
  };
}
