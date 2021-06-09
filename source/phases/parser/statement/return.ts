import { getParseError, ParsePhase } from "..";
import { haveTokens, Token, Tokens } from "../../scanner";
import { ASTNode, Kinds } from "../node";
import { parseTuple, TupleNode } from "./tuple";

export interface ReturnNode extends ASTNode {
  kind: Kinds.return;
  value: TupleNode;
}

export const parseReturn: ParsePhase<ReturnNode> = (tokens: Token[]) => {
  if(haveTokens(tokens, Tokens.return)) {
    const tupleResult = parseTuple(tokens.slice(1));
    if(tupleResult.value) {
      return {
        context: tupleResult.context,
        value: {
          kind: Kinds.return,
          value: tupleResult.value
        },
        errors: []
      };
    } else {
      return {
        context: tupleResult.context,
        value: undefined,
        errors: [
          getParseError(Kinds.return, tokens[0].location),
          ...tupleResult.errors
        ]
      };
    }
  } else {
    return {
      context: tokens,
      value: undefined,
      errors: [
        getParseError(Kinds.return, tokens[0].location)
      ]
    };
  }
};
