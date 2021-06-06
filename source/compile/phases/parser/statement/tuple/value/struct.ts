import { getParseError, ParsePhase } from "../../..";
import { Token, haveTokens, Tokens } from "../../../../scanner";
import { ASTNode, Kinds } from "../../../node";
import { ParametersNode, parseParameters } from "../../../parameters";
import { getErrorResult, getResult, mergeError } from "../../../result";

export interface StructNode extends ASTNode {
  kind: Kinds.struct;
  value: ParametersNode;
}

export const parseStruct: ParsePhase<StructNode> = (tokens: Token[]) => {
  if(haveTokens(tokens, Tokens.open_curly)) {
    const result = parseParameters(tokens.slice(1));
    if(result.value && haveTokens(result.context, Tokens.close_curly)) {
      return getResult(result.context.slice(1), {
        kind: Kinds.struct,
        value: result.value
      });
    } else {
      return mergeError(result, getParseError(Kinds.struct, tokens[0].location));
    }
  } else {
    return getErrorResult(tokens, Kinds.struct);
  }
};
