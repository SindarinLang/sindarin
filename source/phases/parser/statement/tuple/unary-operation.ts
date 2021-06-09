import { getParseError, ParsePhase } from "../..";
import { Tokens, Token, haveTokensIn } from "../../../scanner";
import { ValueOf } from "../../../../utils";
import { ASTNode, Kinds } from "../../node";
import { parseValue, UnaryOperandNode } from "./value";
import { getErrorResult, getResult, mergeError } from "../../result";

export type UnaryOperator = ValueOf<typeof operators>;

const operators = [
  Tokens.not,
  Tokens.subtract,
  Tokens.destruct
];

export interface UnaryOperationNode<T extends UnaryOperator = UnaryOperator> extends ASTNode {
  kind: Kinds.unaryOperation;
  operator: T;
  right: UnaryOperandNode;
}

export const parseUnaryOperation: ParsePhase<UnaryOperationNode> = (tokens: Token[]) => {
  if(haveTokensIn(tokens, operators)) {
    const rightResult = parseValue(tokens.slice(1));
    if(rightResult.value) {
      return getResult(rightResult.context, {
        kind: Kinds.unaryOperation,
        operator: tokens[0].kind,
        right: rightResult.value
      });
    } else { // TODO: if have comma, return SpreadNode
      return mergeError(rightResult, getParseError(Kinds.unaryOperation, tokens[0].location));
    }
  } else {
    return getErrorResult(tokens, Kinds.unaryOperation);
  }
};
