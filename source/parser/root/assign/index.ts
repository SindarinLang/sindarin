import { haveTokens, Token, Tokens } from "../../../lexer";
import { ASTNode, PotentialParseResult } from "../..";
import { ValueNode, parseExpression } from "../expression";
import { TypeNode } from "./type";
import { Kinds } from "../../node";

export interface AssignNode extends ASTNode {
  kind: Kinds.assign;
  identifier: string;
  type: TypeNode;
  value: ValueNode;
}

export function parseAssign(tokens: Token[]): PotentialParseResult<AssignNode> {
  // TODO: parse multiple identifiers, ex: a, b =
  // TODO: parse destructured identifiers: ex: { a, b } = and [a, b] =
  // TODO: parse types
  if(haveTokens(tokens, Tokens.identifier, Tokens.assign)) {
    const result = parseExpression(tokens.slice(2));
    if(haveTokens(result.tokens, Tokens.semi)) {
      return {
        tokens: result.tokens.slice(1),
        node: {
          kind: Kinds.assign,
          identifier: tokens[0].value,
          type: {
            kind: Kinds.type
          },
          value: result.node
        }
      };
    } else {
      throw new Error("syntax error: missing semi-colon");
    }
  } else {
    return undefined;
  }
}

export { ValueKind } from "../expression";
