import { haveTokens, Token, Tokens } from "../../../../lexer";
import { ParseResult } from "../../../";
import { BinaryOperationNode, parseBinaryOperation } from "./binary-operation";
import { OperandNode, parseOperand } from "./operand";

export type ExpressionNode =
  | OperandNode
  | BinaryOperationNode;

export function parseExpression(tokens: Token[]): ParseResult<ExpressionNode> {
  const operandResult = parseOperand(tokens);
  if(operandResult) {
    const result = parseBinaryOperation(operandResult.node, operandResult.tokens);
    if(result && !haveTokens(result.tokens, Tokens.colon)) {
      return result;
    } else {
      return undefined;
    }
  } else {
    throw new Error("Syntax error");
  }
}
