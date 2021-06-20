import { ParsePhase, ParseResult } from "../..";
import { Token } from "../../../scanner";
import { parseCommaList } from "../../list";
import { ASTNode, Kinds } from "../../node";
import { getErrorResult, getResult, getResultFrom } from "../../result";
import { BinaryOperationNode, parseBinaryOperation } from "./binary-operation";
import { parseUnaryOperation, UnaryOperationNode, UnaryOperator } from "./unary-operation";
import { parseValue, UnaryOperandNode } from "./value";
import { parseVoid, VoidNode } from "./void";

export type BinaryOperandNode = UnaryOperationNode<UnaryOperator> | UnaryOperandNode;

export type ExpressionNode = BinaryOperationNode | BinaryOperandNode;

export type TupletNode = ExpressionNode | VoidNode;

export interface TupleNode extends ASTNode {
  kind: Kinds.tuple;
  value: TupletNode[];
}

export const binaryOperandParsers: ParsePhase<BinaryOperandNode>[] = [
  parseUnaryOperation,
  parseValue
];

function getBinaryOperation(left: ParseResult<BinaryOperandNode | BinaryOperationNode>): ParseResult<BinaryOperandNode | BinaryOperationNode> {
  const binaryOperationResult = parseBinaryOperation(left.context);
  if(binaryOperationResult.value) {
    binaryOperationResult.value.left = left.value;
    if(binaryOperationResult.value.left) {
      return getBinaryOperation(binaryOperationResult as ParseResult<BinaryOperandNode | BinaryOperationNode>);
    } else {
      return left;
    }
  } else {
    return left;
  }
}

export const parseExpression: ParsePhase<ExpressionNode> = (tokens: Token[]) => {
  const result = getResultFrom<BinaryOperandNode>(tokens, binaryOperandParsers);
  if(result.value) {
    return getBinaryOperation(result);
  } else {
    return getErrorResult(tokens, "Expression");
  }
};

const elementParsers = [
  parseExpression,
  parseVoid
];

export const parseTuple: ParsePhase<TupleNode> = (tokens: Token[]) => {
  const listResult = parseCommaList<TupletNode>(tokens, elementParsers);
  if(listResult.value) {
    return getResult(listResult.context, {
      kind: Kinds.tuple,
      value: listResult.value.value
    });
  } else {
    return getErrorResult(tokens, Kinds.tuple);
  }
};
