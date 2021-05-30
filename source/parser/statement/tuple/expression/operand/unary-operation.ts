import { ExpressionNode } from "..";
import { ParseResult } from "../../../..";
import { Tokens, Token, haveTokensIn } from "../../../../../lexer";
import { ValueOf } from "../../../../../utils";
import { ASTNode, Kinds } from "../../../../node";
import { parseValueOperation, ValueOperationNode } from "./value-operation";

export type UnaryOperator = ValueOf<typeof operators>;

const operators = [
  Tokens.not,
  Tokens.subtract,
  Tokens.destruct
];

export interface UnaryOperationNode<T extends UnaryOperator = UnaryOperator> extends ASTNode {
  kind: Kinds.unaryOperation;
  operator: T;
  right: ValueOperationNode | ExpressionNode;
}

export function parseUnaryOperation(tokens: Token[]): ParseResult<UnaryOperationNode> {
  if(haveTokensIn(tokens, operators)) {
    const rightResult = parseValueOperation(tokens.slice(1));
    if(rightResult) {
      return {
        tokens: rightResult.tokens,
        node: {
          kind: Kinds.unaryOperation,
          operator: tokens[0].kind,
          right: rightResult.node
        }
      };
    } else { // TODO: if have comma, return SpreadNode
      throw new Error("Syntax error");
    }
  } else {
    return undefined;
  }
}
