import { ParsePhase } from "../../../..";
import { haveTokens, Token, Tokens } from "../../../../../scanner";
import { ASTNode, Kinds } from "../../../../node";
import { getErrorResult } from "../../../../result";

export interface TypeNode extends ASTNode {
  kind: Kinds.type;
  value: string; // -> { type: Boolean, Float, Integer } or for function, { kind: FunctionType, args: Type[], return: Type[] }
}

// TODO: expansions -
//  Type
//  { a: Type, b: Type }
//  [Type, Type]
//  (Type, Type)

export const parseType: ParsePhase<TypeNode> = (tokens: Token[]) => {
  if(haveTokens(tokens, Tokens.colon, Tokens.type) && tokens[1].value) {
    return {
      context: tokens.slice(2),
      value: {
        kind: Kinds.type,
        value: tokens[1].value
      },
      errors: []
    };
  } else {
    return getErrorResult(tokens, Kinds.type, "missing colon");
  }
};
