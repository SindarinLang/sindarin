import { ExpressionNode, parseExpression } from "..";
import { getParseError, ParsePhase } from "../../..";
import { Token, haveTokens, Tokens } from "../../../../scanner";
import { parseCommaList } from "../../../list";
import { ASTNode, Kinds } from "../../../node";
import { getErrorResult, getResult, mergeError } from "../../../result";

export interface ArrayNode extends ASTNode {
  kind: Kinds.array;
  value: ExpressionNode[];
}

export const parseArray: ParsePhase<ArrayNode> = (tokens: Token[]) => {
  if(haveTokens(tokens, Tokens.open_square)) {
    const listResult = parseCommaList<ExpressionNode>(tokens.slice(1), [parseExpression]);
    if(listResult.value && haveTokens(listResult.context, Tokens.close_square)) {
      return getResult(listResult.context.slice(1), {
        kind: Kinds.array,
        value: listResult.value.value
      });
    } else {
      return mergeError(listResult, getParseError(Kinds.array, tokens[0].location));
    }
  } else {
    return getErrorResult(tokens, Kinds.array);
  }
};
