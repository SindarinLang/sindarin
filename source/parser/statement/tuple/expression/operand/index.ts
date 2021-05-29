import reduceFirst from "reduce-first";
import { ParseResult } from "../../../..";
import { Token } from "../../../../../lexer";
import { BinaryOperationNode } from "../binary-operation";
import { parseUnaryOperation, UnaryOperationNode } from "./unary-operation";
import { parseValueOperation, ValueOperationNode } from "./value-operation";

export type OperandNode =
  | ValueOperationNode
  | UnaryOperationNode
  | BinaryOperationNode;

const parsers = [
  parseUnaryOperation,
  parseValueOperation
];

export function parseOperand(tokens: Token[]): ParseResult<OperandNode> {
  return reduceFirst(parsers, (parser) => {
    return parser(tokens);
  });
}
