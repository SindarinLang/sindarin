import { ParsePhase } from "../..";
import { haveTokensIn, Token, Tokens } from "../../../scanner";
import { ASTNode, Kinds } from "../../node";
import { getErrorResult, getResult } from "../../result";

export interface VoidNode extends ASTNode {
  kind: Kinds.void;
}

export const parseVoid: ParsePhase<VoidNode> = (tokens: Token[]) => {
  if(haveTokensIn(tokens, [Tokens.comma, Tokens.close_round])) {
    return getResult(tokens, {
      kind: Kinds.void
    });
  } else {
    return getErrorResult(tokens, Kinds.declaration);
  }
};
