import { ParseResult } from "../..";
import { haveTokens, Token, Tokens } from "../../../lexer";
import { ASTNode, Kinds } from "../../node";
import { parseTuple, TupleNode } from "../tuple";
import { TypeNode } from "./declarations/declaration/type";

export interface AssignNode extends ASTNode {
  kind: Kinds.assign;
  identifier: string;
  type: TypeNode;
  value: TupleNode;
}

export function parseAssign(tokens: Token[]): ParseResult<AssignNode> {
  // TODO: parse listed identifiers, ex: a, b =
  // TODO: parse expansions: ex: { a, b } = and [a, b] =
  // TODO: parse types (declaration)
  if(haveTokens(tokens, Tokens.identifier, Tokens.assign)) {
    const result = parseTuple(tokens.slice(2));
    if(result && haveTokens(result.tokens, Tokens.semi)) {
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
      throw new Error("Syntax error");
    }
  } else {
    return undefined;
  }
}
