import { getParseError, ParsePhase, ParseResult } from "../../..";
import { haveTokens, Token, Tokens } from "../../../../scanner";
import { ASTNode, Kinds } from "../../../node";
import { getErrorResult, mergeError } from "../../../result";
import { IdentifierNode, parseIdentifier } from "../../tuple/value/identifier";
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

export const parseDeclaration: ParsePhase<DeclarationNode> = (tokens: Token[]) => {
  if(haveTokens(tokens, Tokens.identifier)) {
    const identifierResult = parseIdentifier(tokens);
    if(identifierResult.value) {
      const result: ParseResult<DeclarationNode> = {
        context: identifierResult.context,
        value: {
          kind: Kinds.declaration,
          identifier: identifierResult.value
        },
        errors: []
      };
      const typeResult = parseType(tokens.slice(1));
      if(typeResult.value && result.value) {
        result.context = typeResult.context;
        result.value.type = typeResult.value;
      }
      return result;
    } else {
      return mergeError(identifierResult, getParseError(Kinds.declaration, tokens[0].location));
    }
  } else {
    return getErrorResult(tokens, Kinds.declaration, "missing identifier");
  }
};
