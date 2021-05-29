import { StatementNode } from "../../../../../..";
import { ParseResult } from "../../../../../../..";
import { haveTokens, Token, Tokens } from "../../../../../../../../lexer";
import { ASTNode, Kinds } from "../../../../../../../node";
import { ParametersNode } from "./parameters";

export interface FunctionNode extends ASTNode {
  kind: Kinds.function;
  parameters: ParametersNode;
  body: StatementNode[];
}

function isFunction(tokens: Token[]) {
  return haveTokens(tokens, Tokens.open_round, Tokens.identifier, Tokens.colon) ||
    haveTokens(tokens, Tokens.open_round, Tokens.close_round) ||
    haveTokens(tokens, Tokens.open_round, Tokens.comma) ||
    haveTokens(tokens, Tokens.open_round, Tokens.destruct, Tokens.comma) ||
    haveTokens(tokens, Tokens.open_round, Tokens.destruct, Tokens.close_round);
}

export function parseFunction(tokens: Token[]): ParseResult<FunctionNode> {
  if(isFunction(tokens))
  return {
    tokens,
    node: {
      kind: Kinds.function
    }
  };
}
