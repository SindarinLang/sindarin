import { parseValue, ValueNode } from "../..";
import { ASTNode, ParseResult } from "../../../../";
import { Token, Tokens } from "../../../../../lex";
import { Kinds } from "../../../../node";

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

const operators: OperationToken[] = [
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

export const operatorKind = "operator";

export type OperatorKind = typeof operatorKind;

export interface OperatorNode extends ASTNode {
  kind: Kinds.operator;
  operation: OperationToken;
  value: ValueNode;
}

export function parseOperator(tokens: Token[]): ParseResult<OperatorNode> {
  if(isOperator(tokens[0].type)) {
    const result = parseValue(tokens.slice(1));
    return {
      tokens: result.tokens,
      node: {
        kind: Kinds.operator,
        operation: tokens[0].type,
        value: result.node
      }
    };
  } else {
    throw new Error("syntax error");
  }
}

