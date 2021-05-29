import { OperandNode } from "..";
import { TupleNode, parseTuple } from "../../..";
import { ParseResult } from "../../../../..";
import { Token, haveTokens, Tokens } from "../../../../../../lexer";
import { ASTNode, Kinds } from "../../../../../node";

export interface CallOperationNode extends ASTNode {
  kind: Kinds.callOperation;
  left: OperandNode;
  right: TupleNode;
}

export function parseCallOperation(left: OperandNode, tokens: Token[]): ParseResult<CallOperationNode> {
  if(haveTokens(tokens, Tokens.open_round)) {
    const tupleResult = parseTuple(tokens);
    if(tupleResult) {
      return {
        tokens: tupleResult.tokens,
        node: {
          kind: Kinds.callOperation,
          left,
          right: tupleResult.node
        }
      };
    } else {
      throw new Error("Syntax error");
    }
  } else {
    return undefined;
  }
}
