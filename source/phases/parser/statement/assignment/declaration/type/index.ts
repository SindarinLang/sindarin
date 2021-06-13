import { ParsePhase } from "../../../..";
import { haveTokens, Token, Tokens } from "../../../../../scanner";
import { ASTNode, Kinds } from "../../../../node";
import { getErrorResult } from "../../../../result";

type Type = {
  primitive: string;
};

export interface TypeNode extends ASTNode {
  kind: Kinds.type;
  value: Type;
}

export const parseType: ParsePhase<TypeNode> = (tokens: Token[]) => {
  if(haveTokens(tokens, Tokens.colon, Tokens.type) && tokens[1].value) {
    return {
      context: tokens.slice(2),
      value: {
        kind: Kinds.type,
        value: { // TODO: parse function types, etc.
          primitive: tokens[1].value
        }
      },
      errors: []
    };
  } else {
    return getErrorResult(tokens, Kinds.type, "missing colon");
  }
};
