import { OperandNode } from "..";
import { ExpressionNode, parseExpression } from "../..";
import { ParseResult } from "../../../../..";
import { Token, haveTokens, Tokens } from "../../../../../../scanner";
import { ASTNode, Kinds } from "../../../../../node";
import { parseValue } from "./value";

export interface AccessorNode extends ASTNode {
  kind: Kinds.accessor;
  left: OperandNode;
  right: ExpressionNode;
}

export function parseAccessor(left: OperandNode, tokens: Token[]): ParseResult<AccessorNode> {
  if(haveTokens(tokens, Tokens.dot)) {
    // should only be integer or identifier
    const valueResult = parseValue(tokens.slice(1));
    if(valueResult) {
      return {
        tokens: valueResult.tokens,
        node: {
          kind: Kinds.accessor,
          left,
          right: valueResult.node
        }
      };
    } else {
      throw new Error("Syntax error");
    }
  } else if(haveTokens(tokens, Tokens.open_square)) {
    const expressionResult = parseExpression(tokens.slice(1));
    if(expressionResult && haveTokens(expressionResult.tokens, Tokens.close_square)) {
      return {
        tokens: expressionResult.tokens.slice(1),
        node: {
          kind: Kinds.accessor,
          left,
          right: expressionResult.node
        }
      };
    } else {
      throw new Error("Syntax error");
    }
  } else {
    return undefined;
  }
}
