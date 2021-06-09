import { StatementNode, parseStatements } from "../..";
import { getParseError, ParsePhase } from "../../..";
import { haveTokens, Token, Tokens } from "../../../../scanner";
import { ASTNode, Kinds } from "../../../node";
import { ParametersNode, parseParameters } from "../../../parameters";
import { getErrorResult, getResult, mergeError } from "../../../result";

export interface FunctionNode extends ASTNode {
  kind: Kinds.function;
  parameters: ParametersNode;
  value: StatementNode[];
}

export const parseFunction: ParsePhase<FunctionNode> = (tokens: Token[]) => {
  const result = getResult<FunctionNode>(tokens, {
    kind: Kinds.function,
    parameters: {
      kind: Kinds.parameters,
      value: []
    },
    value: []
  });
  if(haveTokens(result.context, Tokens.open_round)) {
    const parametersResult = parseParameters(tokens.slice(1));
    // TODO: parse type
    if(parametersResult.value && haveTokens(parametersResult.context, Tokens.close_round, Tokens.arrow)) {
      result.context = parametersResult.context.slice(2);
      result.value.parameters = parametersResult.value;
    } else {
      return mergeError(parametersResult, getParseError(Kinds.function, tokens[0].location));
    }
  }
  if(haveTokens(result.context, Tokens.open_curly)) {
    const bodyResult = parseStatements(result.context.slice(1));
    if(bodyResult.value && haveTokens(bodyResult.context, Tokens.close_curly)) {
      result.value.value = bodyResult.value.value;
      result.context = bodyResult.context.slice(1);
      return result;
    } else {
      return mergeError(bodyResult, getParseError(Kinds.function, tokens[0].location));
    }
  } else {
    return getErrorResult(tokens, Kinds.function);
  }
};
