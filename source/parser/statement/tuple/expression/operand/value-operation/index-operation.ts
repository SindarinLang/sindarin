import { OperandNode } from "..";
import { ExpressionNode, parseExpression } from "../..";
import { ParseResult } from "../../../../..";
import { Token, haveTokens, Tokens } from "../../../../../../lexer";
import { ASTNode, Kinds } from "../../../../../node";

export interface IndexOperationNode extends ASTNode {
  kind: Kinds.indexOperation;
  left: OperandNode;
  right: ExpressionNode;
}

export function parseIndexOperation(left: OperandNode, tokens: Token[]): ParseResult<IndexOperationNode> {
  if(haveTokens(tokens, Tokens.open_square)) {
    const expressionResult = parseExpression(tokens.slice(1));
    if(expressionResult && haveTokens(expressionResult.tokens, Tokens.close_square)) {
      return {
        tokens: expressionResult.tokens.slice(1),
        node: {
          kind: Kinds.indexOperation,
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
