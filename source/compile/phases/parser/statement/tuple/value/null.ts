import { ParsePhase } from "../../..";
import { Token, haveTokens, Tokens } from "../../../../scanner";
import { ASTNode, Kinds } from "../../../node";
import { getErrorResult, getResult } from "../../../result";

export interface NullNode extends ASTNode {
  kind: Kinds.null;
  value: null;
}

export const parseNull: ParsePhase<NullNode> = (tokens: Token[]) => {
  if(haveTokens(tokens, Tokens.null)) {
    return getResult(tokens.slice(1), {
      kind: Kinds.null,
      value: null
    });
  } else {
    return getErrorResult(tokens, Kinds.null);
  }
};
