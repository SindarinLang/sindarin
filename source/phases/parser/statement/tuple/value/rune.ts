import { haveTokens, Token, Tokens } from "../../../../scanner";
import { ParsePhase } from "../../..";
import { ASTNode, Kinds } from "../../../node";
import { getErrorResult, getResult } from "../../../result";

export interface RuneNode extends ASTNode {
  kind: Kinds.rune;
  value: string;
}

export const parseRune: ParsePhase<RuneNode> = (tokens: Token[]) => {
  if(haveTokens(tokens, Tokens.rune)) {
    if(tokens[0].value) {
      return getResult(tokens.slice(1), {
        kind: Kinds.rune,
        value: tokens[0].value
      });
    } else {
      return getErrorResult(tokens, Kinds.rune, "missing rune value");
    }
  } else {
    return getErrorResult(tokens, Kinds.rune);
  }
};
