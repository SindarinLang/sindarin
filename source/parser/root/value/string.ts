import { Token } from "../../../lexer";
import { ParseResult, ASTNode, Kinds } from "../..";

export interface StringNode extends ASTNode {
  kind: Kinds.string;
  value: string;
}

export function parseString(tokens: Token[]): ParseResult<StringNode> {
  return {
    tokens: tokens.slice(1),
    node: {
      kind: Kinds.string,
      value: tokens[0].value
    }
  };
}
