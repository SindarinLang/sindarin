import { Token, haveTokens, Tokens } from "../../../../scanner";
import { ASTNode, Kinds } from "../../../node";
import { getErrorResult, getResult, mergeError } from "../../../result";
import { getParseError, ParsePhase } from "../../..";
import { ExpressionNode, parseExpression } from "..";

export interface StringNode extends ASTNode {
  kind: Kinds.string;
  value: (string | ExpressionNode)[];
}

export const parseString: ParsePhase<StringNode> = (tokens: Token[]) => {
  if(haveTokens(tokens, Tokens.open_quote)) {
    const result = getResult<StringNode>(tokens.slice(1), {
      kind: Kinds.string,
      value: []
    });
    while(!haveTokens(result.context, Tokens.close_quote)) {
      if(haveTokens(result.context, Tokens.string) && result.context[0].value) {
        result.value.value.push(result.context[0].value);
        result.context = result.context.slice(1);
      } else if(haveTokens(result.context, Tokens.open_template)) {
        const expressionResult = parseExpression(result.context.slice(1));
        if(expressionResult.value && haveTokens(expressionResult?.context, Tokens.close_template)) {
          result.value.value.push(expressionResult.value);
          result.context = expressionResult.context.slice(1);
        } else {
          return mergeError(expressionResult, getParseError(Kinds.string, tokens[0].location));
        }
      } else {
        return getErrorResult(tokens, Kinds.string);
      }
    }
    return result;
  } else {
    return getErrorResult(tokens, Kinds.string);
  }
};
