import { ValueNode } from ".";
import { parseExpression } from "..";
import { ParseResult, PotentialParseResult } from "../../..";
import { haveTokens, Token, Tokens } from "../../../../lexer";
import { ASTNode, Kinds } from "../../../node";

export interface ArrayNode extends ASTNode {
  kind: Kinds.array;
  value: ValueNode[];
}

export function parseArray(tokens: Token[]): PotentialParseResult<ArrayNode> {
  if(haveTokens(tokens, Tokens.open_square)) {
    const result: ParseResult<ArrayNode> = {
      tokens: tokens.slice(1),
      node: {
        kind: Kinds.array,
        value: []
      }
    };
    while(!haveTokens(result.tokens, Tokens.close_square)) {
      const valueResult = parseExpression(result.tokens);
      result.tokens = valueResult.tokens;
      result.node.value.push(valueResult.node);
      if(haveTokens(result.tokens, Tokens.comma)) {
        result.tokens = result.tokens.slice(1);
      }
    }
    return {
      tokens: result.tokens.slice(1),
      node: result.node
    };
  } else {
    return undefined;
  }
}
