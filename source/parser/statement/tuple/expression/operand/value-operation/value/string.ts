import { ExpressionNode, parseExpression } from "../../..";
import { ParseResult } from "../../../../../..";
import { Token, haveTokens, Tokens } from "../../../../../../../lexer";
import { ASTNode, Kinds } from "../../../../../../node";

export interface StringNode extends ASTNode {
  kind: Kinds.string;
  value: (string | ExpressionNode)[];
}

export function parseString(tokens: Token[]): ParseResult<StringNode> {
  if(haveTokens(tokens, Tokens.open_quote)) {
    const result: ParseResult<StringNode> = {
      tokens: tokens.slice(1),
      node: {
        kind: Kinds.string,
        value: []
      }
    };
    while(!haveTokens(result.tokens, Tokens.close_quote)) {
      if(haveTokens(result.tokens, Tokens.string)) {
        result.node.value.push(result.tokens[0].value);
        result.tokens = result.tokens.slice(1);
      } else if(haveTokens(result.tokens, Tokens.open_template)) {
        const expressionResult = parseExpression(result.tokens.slice(1));
        if(expressionResult && haveTokens(expressionResult?.tokens, Tokens.close_template)) {
          result.node.value.push(expressionResult.node);
          result.tokens = expressionResult.tokens.slice(1);
        } else {
          throw new Error("Syntax error");
        }
      } else {
        throw new Error("Syntax error");
      }
    }
    return result;
  } else {
    return undefined;
  }
}
