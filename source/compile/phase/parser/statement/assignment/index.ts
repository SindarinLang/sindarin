import { ParseResult } from "../..";
import { haveTokens, Token, Tokens } from "../../../scanner";
import { ASTNode, Kinds } from "../../node";
import { parseTuple, TupleNode } from "../tuple";
import { DeclarationNode, parseDeclaration } from "./declaration";

export interface AssignmentNode extends ASTNode {
  kind: Kinds.assignment;
  declaration: DeclarationNode;
  value?: TupleNode;
}

export function parseAssign(tokens: Token[]): ParseResult<AssignmentNode> {
  if(haveTokens(tokens, Tokens.identifier, Tokens.colon) || haveTokens(tokens, Tokens.identifier, Tokens.assign)) {
    const declarationResult = parseDeclaration(tokens);
    if(declarationResult) {
      const result: ParseResult<AssignmentNode> = {
        tokens: declarationResult.tokens,
        node: {
          kind: Kinds.assignment,
          declaration: declarationResult.node
        }
      };
      if(haveTokens(declarationResult.tokens, Tokens.assign)) {
        const tupleResult = parseTuple(declarationResult.tokens.slice(1));
        if(tupleResult) {
          result.tokens = tupleResult.tokens;
          result.node.value = tupleResult.node;
          return result;
        } else {
          throw new Error("Syntax error");
        }
      } else {
        return result;
      }
    } else {
      throw new Error("Syntax error");
    }
  } else {
    return undefined;
  }
}
