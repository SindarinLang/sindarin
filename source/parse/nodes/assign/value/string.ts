import { Token } from "../../../../lex";
import { ParseResult, ASTNode } from "../../..";

export const stringKind = "string";

export interface StringNode extends ASTNode {
  kind: typeof stringKind;
  value: string;
}

export function parseString(tokens: Token[]): ParseResult<StringNode> {
  return {
    tokens: tokens.slice(1),
    node: {
      kind: stringKind,
      value: tokens[0].value
    }
  };
}
