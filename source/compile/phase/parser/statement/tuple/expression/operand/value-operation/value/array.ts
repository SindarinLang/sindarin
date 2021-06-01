import { ExpressionNode, parseExpression } from "../../..";
import { ParseResult } from "../../../../../..";
import { Token, haveTokens, Tokens } from "../../../../../../../scanner";
import { ListNode, parseCommaList } from "../../../../../../list";
import { ASTNode, Kinds } from "../../../../../../node";

export interface ArrayNode extends ASTNode {
  kind: Kinds.array;
  value: ListNode<ExpressionNode>;
}

export function parseArray(tokens: Token[]): ParseResult<ArrayNode> {
  if(haveTokens(tokens, Tokens.open_square)) {
    const listResult = parseCommaList(tokens.slice(1), [parseExpression]);
    if(listResult && haveTokens(listResult.tokens, Tokens.close_square)) {
      return {
        tokens: listResult.tokens,
        node: {
          kind: Kinds.array,
          value: listResult.node
        }
      };
    } else {
      throw new Error("Syntax error");
    }
  } else {
    return undefined;
  }
}
