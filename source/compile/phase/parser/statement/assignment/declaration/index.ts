import { ParseResult } from "../../..";
import { haveTokens, Token, Tokens } from "../../../../scanner";
import { ASTNode, Kinds } from "../../../node";
import { IdentifierNode, parseIdentifier } from "../../tuple/expression/operand/value-operation/value/identifier";
import { parseType, TypeNode } from "./type";

export interface DeclarationNode extends ASTNode {
  kind: Kinds.declaration;
  identifier: IdentifierNode;
  type?: TypeNode;
}

// TODO: expansions - (desugar types to type node)
//  a
//  { a, b }
//  { a: Type, b: Type }
//  [a, b]
//  [a: Type, b: Type]
//  (a, b)
//  (a: Type, b: Type)

export function parseDeclaration(tokens: Token[]): ParseResult<DeclarationNode> {
  if(haveTokens(tokens, Tokens.identifier)) {
    const identifierResult = parseIdentifier(tokens);
    if(identifierResult) {
      const result: ParseResult<DeclarationNode> = {
        tokens: identifierResult.tokens,
        node: {
          kind: Kinds.declaration,
          identifier: identifierResult.node
        }
      };
      const typeResult = parseType(tokens.slice(1));
      if(typeResult) {
        result.tokens = typeResult.tokens;
        result.node.type = typeResult.node;
      }
      return result;
    } else {
      throw new Error("Syntax error");
    }
  } else {
    return undefined;
  }
}
