import { getParseError, ParsePhase } from ".";
import { haveTokens, Token, Tokens } from "../scanner";
import { ASTNode, Kinds } from "./node";

export interface SpreadNode extends ASTNode {
  kind: Kinds.spread;
}

export const parseSpread: ParsePhase<SpreadNode> = (tokens: Token[]) => {
  if(haveTokens(tokens, Tokens.destruct)) {
    return {
      context: tokens.slice(1),
      value: {
        kind: Kinds.spread
      },
      errors: []
    };
  } else {
    return {
      context: tokens,
      value: undefined,
      errors: [
        getParseError(Kinds.spread, tokens[0].location)
      ]
    };
  }
};
