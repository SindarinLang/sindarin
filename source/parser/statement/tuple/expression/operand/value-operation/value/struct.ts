import { ExpressionNode, parseExpression } from "../../..";
import { ParseResult } from "../../../../../..";
import { Token, haveTokens, Tokens } from "../../../../../../../lexer";
import { ASTNode, Kinds } from "../../../../../../node";

export interface StructNode extends ASTNode {
  kind: Kinds.struct;
  value: {
    [key: string]: ExpressionNode;
  };
}

export function parseStruct(tokens: Token[]): ParseResult<StructNode> {
  if(haveTokens(tokens, Tokens.open_curly)) {
    const result: ParseResult<StructNode> = {
      tokens: tokens.slice(1),
      node: {
        kind: Kinds.struct,
        value: {}
      }
    };
    while(!haveTokens(result.tokens, Tokens.close_curly)) {
      if(haveTokens(result.tokens, Tokens.identifier, Tokens.assign)) {
        const valueResult = parseExpression(result.tokens.slice(2));
        if(valueResult) {
          const key = result.tokens[0].value;
          result.tokens = valueResult.tokens;
          result.node.value[key] = valueResult.node;
        } else {
          throw new Error("syntax error");
        }
      } else {
        throw new Error("syntax error");
      }
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
