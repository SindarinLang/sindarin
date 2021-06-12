import { StatementNode, parseStatements } from "../..";
import { getParseError, ParsePhase } from "../../..";
import { haveTokens, Token, Tokens } from "../../../../scanner";
import { ASTNode, Kinds, TypeNode } from "../../../node";
import { ParametersNode, parseParameters } from "../../../parameters";
import { getErrorResult, getResult, mergeError } from "../../../result";
import { parseType } from "../../assignment/declaration/type";

export interface FunctionNode extends ASTNode {
  kind: Kinds.function;
  parameters: ParametersNode;
  type: TypeNode;
  value: StatementNode[];
}

export const parseFunction: ParsePhase<FunctionNode> = (tokens: Token[]) => {
  const result = getResult<FunctionNode>(tokens, {
    kind: Kinds.function,
    parameters: {
      kind: Kinds.parameters,
      value: []
    },
    type: {
      kind: Kinds.type,
      value: "Void"
    },
    value: []
  });
  if(haveTokens(result.context, Tokens.open_round)) {
    const parametersResult = parseParameters(tokens.slice(1));
    if(parametersResult.value && haveTokens(parametersResult.context, Tokens.close_round, Tokens.colon)) {
      const typeResult = parseType(parametersResult.context.slice(1));
      if(typeResult.value && haveTokens(typeResult.context, Tokens.arrow)) {
        result.context = typeResult.context.slice(1);
        result.value.parameters = parametersResult.value;
        result.value.type = typeResult.value;
      } else {
        return mergeError(typeResult, getParseError(Kinds.function, tokens[0].location));
      }
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
