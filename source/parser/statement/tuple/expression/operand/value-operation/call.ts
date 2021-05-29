import { OperandNode } from "..";
import { TupleNode, parseTuple } from "../../..";
import { ParseResult } from "../../../../..";
import { Token, haveTokens, Tokens } from "../../../../../../lexer";
import { ASTNode, Kinds } from "../../../../../node";

export interface CallNode extends ASTNode {
  kind: Kinds.call;
  callee: OperandNode;
  arguments: TupleNode;
}

// Left should be identifier, indexOperation, Tokens.dot binary operation
export function parseCall(left: OperandNode, tokens: Token[]): ParseResult<CallNode> {
  if(haveTokens(tokens, Tokens.open_round)) {
    const tupleResult = parseTuple(tokens.slice(1));
    if(tupleResult && haveTokens(tupleResult.tokens, Tokens.close_round)) {
      return {
        tokens: tupleResult.tokens.slice(1),
        node: {
          kind: Kinds.call,
          callee: left,
          arguments: tupleResult.node
        }
      };
    } else {
      throw new Error("Syntax error");
    }
  } else {
    return undefined;
  }
}
