import { Token, Tokens } from "../../../lex";
import { ParseResult, ASTNode } from "../../";
import { ValueNode, parseValue } from "../value";
import { TypeNode } from "./type";
import { Kinds } from "../../node";

export interface AssignNode extends ASTNode {
  kind: Kinds.assign;
  identifier: string;
  type: TypeNode;
  value: ValueNode;
}

export function parseAssign(tokens: Token[]): ParseResult<AssignNode> {
  // TODO: parse multiple identifiers, ex: a, b =
  // TODO: parse destructured identifiers: ex: { a, b } = and [a, b] =
  // TODO: parse types
  const result = parseValue(tokens.slice(2));
  if(result.tokens[0].type === Tokens.semi) {
    return {
      tokens: result.tokens.slice(1),
      node: {
        kind: Kinds.assign,
        identifier: tokens[0].value,
        type: {
          kind: "type"
        },
        value: result.node
      }
    };
  } else {
    throw new Error("syntax error: missing semi-colon");
  }
}

export { ValueKind } from "../value";
