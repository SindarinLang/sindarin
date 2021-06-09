import { getParseError, ParsePhase } from "../..";
import { haveTokens, Token, Tokens } from "../../../scanner";
import { ASTNode, Kinds } from "../../node";
import { getErrorResult, getResult, mergeError } from "../../result";
import { parseTuple, TupleNode } from "../tuple";
import { DeclarationNode, parseDeclaration } from "./declaration";

export interface AssignmentNode extends ASTNode {
  kind: Kinds.assignment;
  declaration: DeclarationNode;
  value?: TupleNode;
}

export const parseAssign: ParsePhase<AssignmentNode> = (tokens: Token[]) => {
  if(haveTokens(tokens, Tokens.identifier, Tokens.colon) || haveTokens(tokens, Tokens.identifier, Tokens.assign)) {
    const declarationResult = parseDeclaration(tokens);
    if(declarationResult.value) {
      const result = getResult<AssignmentNode>(declarationResult.context, {
        kind: Kinds.assignment,
        declaration: declarationResult.value
      });
      if(haveTokens(declarationResult.context, Tokens.assign)) {
        const tupleResult = parseTuple(declarationResult.context.slice(1));
        if(result.value && tupleResult.value) {
          result.context = tupleResult.context;
          result.value.value = tupleResult.value;
          return result;
        } else {
          return mergeError(tupleResult, getParseError(Kinds.assignment, tokens[0].location));
        }
      } else {
        return result;
      }
    } else {
      return mergeError(declarationResult, getParseError(Kinds.assignment, tokens[0].location));
    }
  } else {
    return getErrorResult(tokens, Kinds.assignment);
  }
};
