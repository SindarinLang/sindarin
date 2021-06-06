import { ParsePhase } from "../../..";
import { Token, haveTokens, Tokens } from "../../../../scanner";
import { ASTNode, Kinds } from "../../../node";
import { getErrorResult, getResult } from "../../../result";

export interface NumberNode extends ASTNode {
  kind: Kinds.number;
  value: number;
}

export const parseNumberValue: ParsePhase<NumberNode> = (tokens: Token[]) => {
  if(haveTokens(tokens, Tokens.number) && tokens[0].value) {
    return getResult(tokens.slice(1), {
      kind: Kinds.number,
      value: parseInt(tokens[0].value)
    });
  } else {
    return getErrorResult(tokens, Kinds.number);
  }
};
