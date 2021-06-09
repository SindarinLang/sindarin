import { getParseError, ParsePhase } from "../..";
import { Tokens, Token, haveTokensIn } from "../../../scanner";
import { ValueOf } from "../../../../utils";
import { ASTNode, Kinds } from "../../node";
import { getErrorResult, getResult, mergeError } from "../../result";
import { ExpressionNode, parseExpression } from ".";

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

export interface PartialBinaryOperationNode<T extends BinaryOperator = BinaryOperator> extends ASTNode {
  kind: Kinds.binaryOperation;
  left?: ExpressionNode;
  operator: T;
  right: ExpressionNode;
}

export interface BinaryOperationNode<T extends BinaryOperator = BinaryOperator> extends PartialBinaryOperationNode<T> {
  left: ExpressionNode;
}

export const parseBinaryOperation: ParsePhase<PartialBinaryOperationNode> = (tokens: Token[]) => {
  if(haveTokensIn(tokens, operators)) {
    const rightResult = parseExpression(tokens.slice(1));
    if(rightResult.value) {
      return getResult(rightResult.context, {
        kind: Kinds.binaryOperation,
        operator: tokens[0].kind,
        right: rightResult.value
      });
    } else {
      return mergeError(rightResult, getParseError(Kinds.binaryOperation, tokens[0].location));
    }
  } else {
    return getErrorResult(tokens, Kinds.binaryOperation);
  }
};
