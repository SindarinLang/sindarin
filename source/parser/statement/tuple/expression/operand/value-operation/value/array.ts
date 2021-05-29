import { ValueNode } from ".";
import { parseExpression } from "../../..";
import { ParseResult } from "../../../../../..";
import { Token, haveTokens, Tokens } from "../../../../../../../lexer";
import { ASTNode, Kinds } from "../../../../../../node";


export interface ArrayNode extends ASTNode {
  kind: Kinds.array;
  value: ValueNode[];
}

export function parseArray(tokens: Token[]): ParseResult<ArrayNode> {
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
      if(valueResult) {
        result.tokens = valueResult.tokens;
        result.node.value.push(valueResult.node);
        if(haveTokens(result.tokens, Tokens.comma)) {
          result.tokens = result.tokens.slice(1);
        } else if(!haveTokens(result.tokens, Tokens.close_square)) {
          throw new Error("Syntax error");
        }
      } else {
        throw new Error("Syntax error");
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
