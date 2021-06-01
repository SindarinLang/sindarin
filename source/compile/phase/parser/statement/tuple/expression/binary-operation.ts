import { ParseResult } from "../../..";
import { Tokens, Token, haveTokensIn } from "../../../../scanner";
import { ValueOf } from "../../../../../../utils";
import { ASTNode, Kinds } from "../../../node";
import { OperandNode, parseOperand } from "./operand";

type BinaryOperator = ValueOf<typeof operators>;

export type BitwiseOperator = ValueOf<typeof bitwiseOperators>;

export type LogicalOperator = ValueOf<typeof logicalOperators>;

export type IntegerOperator = ValueOf<typeof integerOperators>;

export type NumericOperator = ValueOf<typeof numericOperators>;

export type ComparisonOperator = ValueOf<typeof comparisonOperators>;

export type ConditionalOperator = ValueOf<typeof conditionalOperators>;

export type FunctionalOperator = ValueOf<typeof functionalOperators>;

const bitwiseOperators = [
  Tokens.bitwise_and,
  Tokens.bitwise_or
];

const logicalOperators = [
  Tokens.logical_and,
  Tokens.logical_or
];

const integerOperators = [
  Tokens.add,
  Tokens.subtract,
  Tokens.multiply,
  Tokens.modulus
];

const numericOperators = [
  ...integerOperators,
  Tokens.divide
];

const comparisonOperators = [
  Tokens.equals,
  Tokens.not_equals,
  Tokens.less_than,
  Tokens.greater_than,
  Tokens.less_than_equals,
  Tokens.greater_than_equals
];

const conditionalOperators = [
  Tokens.conditional,
  Tokens.default
];

const functionalOperators = [
  Tokens.forward,
  Tokens.backward
];

export const operators = [
  ...bitwiseOperators,
  ...logicalOperators,
  ...numericOperators,
  ...comparisonOperators,
  ...conditionalOperators,
  ...functionalOperators
];

export function isBinaryOperation<T extends BinaryOperator>(operation: BinaryOperationNode, operator: T): operation is BinaryOperationNode<T> {
  return operation.operator === operator;
}

export function isBinaryOperationIn<T extends BinaryOperator>(operation: BinaryOperationNode, operator: T[]): operation is BinaryOperationNode<T> {
  return (operator as string[]).includes(operation.operator as string);
}

export function isBitwiseOperation(operation: BinaryOperationNode): operation is BinaryOperationNode<BitwiseOperator> {
  return isBinaryOperationIn(operation, bitwiseOperators);
}

export function isLogicalOperation(operation: BinaryOperationNode): operation is BinaryOperationNode<LogicalOperator> {
  return isBinaryOperationIn(operation, logicalOperators);
}

export function isComparisonOperation(operation: BinaryOperationNode): operation is BinaryOperationNode<ComparisonOperator> {
  return isBinaryOperationIn(operation, comparisonOperators);
}

export function isIntegerOperation(operation: BinaryOperationNode): operation is BinaryOperationNode<IntegerOperator> {
  return isBinaryOperationIn(operation, integerOperators);
}

export function isNumericOperation(operation: BinaryOperationNode): operation is BinaryOperationNode<NumericOperator> {
  return isBinaryOperationIn(operation, numericOperators);
}

export function isConditionalOperation(operation: BinaryOperationNode): operation is BinaryOperationNode<ConditionalOperator> {
  return isBinaryOperationIn(operation, conditionalOperators);
}

export function isFunctionalOperation(operation: BinaryOperationNode): operation is BinaryOperationNode<FunctionalOperator> {
  return isBinaryOperationIn(operation, functionalOperators);
}

export interface BinaryOperationNode<T extends BinaryOperator = BinaryOperator> extends ASTNode {
  kind: Kinds.binaryOperation;
  left: OperandNode;
  operator: T;
  right: OperandNode;
}

export function parseBinaryOperation(left: OperandNode, tokens: Token[]): ParseResult<OperandNode> {
  if(haveTokensIn(tokens, operators)) {
    const rightResult = parseOperand(tokens.slice(1));
    if(rightResult) {
      return parseBinaryOperation({
        kind: Kinds.binaryOperation,
        left,
        operator: tokens[0].kind,
        right: rightResult.node
      }, rightResult.tokens);
    } else {
      throw new Error("Syntax error");
    }
  } else {
    return {
      tokens,
      node: left
    };
  }
}
