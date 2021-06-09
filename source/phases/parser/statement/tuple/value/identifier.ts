import { ParsePhase } from "../../..";
import { Token, haveTokens, Tokens } from "../../../../scanner";
import { ASTNode, Kinds } from "../../../node";
import { getErrorResult, getResult } from "../../../result";

export interface IdentifierNode extends ASTNode {
  kind: Kinds.identifier;
  value: string;
}

export const parseIdentifier: ParsePhase<IdentifierNode> = (tokens: Token[]) => {
  if(haveTokens(tokens, Tokens.identifier) && tokens[0].value) {
    return getResult(tokens.slice(1), {
      kind: Kinds.identifier,
      value: tokens[0].value
    });
  } else {
    return getErrorResult(tokens, Kinds.identifier);
  }
};
