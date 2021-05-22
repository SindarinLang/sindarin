import { parseValue, ValueNode } from "..";
import { ASTNode, ParseResult } from "../../..";
import { Token, Tokens } from "../../../../lex";
import { Kinds } from "../../../node";

export type IntegerOperationToken =
  | Tokens.add
  | Tokens.subtract
  | Tokens.multiply
  | Tokens.modulus;

export type NumericOperationToken = IntegerOperationToken
  | Tokens.divide;
  // | Tokens.carrot;

const integerOperations: IntegerOperationToken[] = [
  Tokens.add,
  Tokens.subtract,
  Tokens.multiply,
  Tokens.modulus
];

const numericOperators: NumericOperationToken[] = [
  ...integerOperations,
  Tokens.divide
  // Tokens.carrot
];

export type OperationToken =
  | Tokens.destruct
  | Tokens.eq
  | Tokens.lte
  | Tokens.gte
  | Tokens.default
  | Tokens.neq
  | Tokens.add
  | Tokens.subtract
  | Tokens.lt
  | Tokens.gt
  | Tokens.question
  | Tokens.colon
  | Tokens.and
  | Tokens.or
  | Tokens.carrot
  | Tokens.multiply
  | Tokens.divide
  | Tokens.modulus
  | Tokens.not;

export const operators: OperationToken[] = [
  Tokens.destruct,
  Tokens.eq,
  Tokens.lte,
  Tokens.gte,
  Tokens.default,
  Tokens.neq,
  Tokens.add,
  Tokens.subtract,
  Tokens.lt,
  Tokens.gt,
  Tokens.question,
  Tokens.colon,
  Tokens.and,
  Tokens.or,
  Tokens.carrot,
  Tokens.multiply,
  Tokens.divide,
  Tokens.modulus,
  Tokens.not
];

export function isOperator(token: Tokens): token is OperationToken {
  return operators.includes(token as OperationToken);
}

export function isIntegerOperation(token: OperationToken): token is IntegerOperationToken {
  return integerOperations.includes(token as IntegerOperationToken);
}

export function isNumericOperation(token: OperationToken): token is NumericOperationToken {
  return numericOperators.includes(token as NumericOperationToken);
}

export const operatorKind = "operator";

export type OperatorKind = typeof operatorKind;

export interface OperatorNode extends ASTNode {
  kind: Kinds.operator;
  left: ValueNode;
  operation: OperationToken;
  right: ValueNode;
}

export function parseOperator(left: ValueNode, tokens: Token[]): ParseResult<OperatorNode> {
  if(isOperator(tokens[0].type)) {
    const result = parseValue(tokens.slice(1));
    return {
      tokens: result.tokens,
      node: {
        kind: Kinds.operator,
        left,
        operation: tokens[0].type,
        right: result.node
      }
    };
  } else {
    throw new Error("syntax error");
  }
}

