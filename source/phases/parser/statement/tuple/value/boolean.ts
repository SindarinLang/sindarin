import { ParsePhase } from "../../..";
import { Token, haveTokens, Tokens } from "../../../../scanner";
import { ASTNode, Kinds } from "../../../node";
import { getErrorResult, getResult } from "../../../result";

export interface BooleanNode extends ASTNode {
  kind: Kinds.boolean;
  value: boolean;
}

export const parseBoolean: ParsePhase<BooleanNode> = (tokens: Token[]) => {
  if(haveTokens(tokens, Tokens.true) || haveTokens(tokens, Tokens.false)) {
    return getResult(tokens.slice(1), {
      kind: Kinds.boolean,
      value: tokens[0].kind === Tokens.true
    });
  } else {
    return getErrorResult(tokens, Kinds.boolean);
  }
};
