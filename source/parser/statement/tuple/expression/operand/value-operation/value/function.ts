import { StatementNode, parseStatements } from "../../../../..";
import { ParseResult } from "../../../../../..";
import { haveTokens, Token, Tokens } from "../../../../../../../lexer";
import { ListNode } from "../../../../../../list";
import { ASTNode, Kinds } from "../../../../../../node";
import { ParametersNode, parseParameters } from "../../../../../../parameters";

export interface FunctionNode extends ASTNode {
  kind: Kinds.function;
  parameters: ParametersNode;
  body: ListNode<StatementNode>;
}

export function parseFunction(tokens: Token[]): ParseResult<FunctionNode> {
  const result: NonNullable<ParseResult<FunctionNode>> = {
    tokens,
    node: {
      kind: Kinds.function,
      parameters: {
        kind: Kinds.parameters,
        value: {
          kind: Kinds.list,
          value: []
        }
      },
      body: {
        kind: Kinds.list,
        value: []
      }
    }
  };
  if(haveTokens(result.tokens, Tokens.open_round)) {
    const parametersResult = parseParameters(tokens.slice(1));
    if(parametersResult && haveTokens(parametersResult.tokens, Tokens.close_round, Tokens.arrow)) {
      result.tokens = parametersResult.tokens.slice(2);
      result.node.parameters = parametersResult.node;
    } else {
      return undefined;
    }
  }
  if(haveTokens(result.tokens, Tokens.open_curly)) {
    const bodyResult = parseStatements(result.tokens.slice(1));
    if(bodyResult) {
      result.node.body = bodyResult.node;
      result.tokens = bodyResult.tokens;
      return result;
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
}
