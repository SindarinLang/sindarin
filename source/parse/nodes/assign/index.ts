import { Token } from "../../../lex";
import { ParseResult, ASTNode } from "../..";
import { ValueNode, parseValue } from "./value";

export const assignKind = "assign";

export interface AssignNode extends ASTNode {
  kind: typeof assignKind;
  identifier: string;
  type: TypeNode;
  value: ValueNode;
}

interface TypeNode extends ASTNode {
  kind: "type";
}

export function parseAssign(tokens: Token[]): ParseResult<AssignNode> {
  // TODO: parse multiple identifiers, ex: a, b =
  // TODO: parse destructured identifiers: ex: { a, b } = and [a, b] =
  // TODO: parse types
  const result = parseValue(tokens.slice(2));
  return {
    tokens: result.tokens,
    node: {
      kind: assignKind,
      identifier: tokens[0].value,
      type: {
        kind: "type"
      },
      value: result.node
    }
  };
}
