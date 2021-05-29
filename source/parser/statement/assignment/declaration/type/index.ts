import { ParseResult } from "../../../..";
import { haveTokens, Token, Tokens } from "../../../../../lexer";
import { ASTNode, Kinds } from "../../../../node";

export interface TypeNode extends ASTNode {
  kind: Kinds.type;
  value: string; // Boolean, Float, Integer
}

// TODO: expansions -
//  Type
//  { a: Type, b: Type }
//  [Type, Type]
//  (Type, Type)

export function parseType(tokens: Token[]): ParseResult<TypeNode> {
  if(haveTokens(tokens, Tokens.colon, Tokens.type)) {
    return {
      tokens: tokens.slice(2),
      node: {
        kind: Kinds.type,
        value: tokens[1].value
      }
    };
  } else {
    return undefined;
  }
}
