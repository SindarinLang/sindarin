import { TupleNode, parseTuple, ExpressionNode } from "../..";
import { getParseError, ParseResult } from "../../../..";
import { Token, haveTokens, Tokens } from "../../../../../scanner";
import { ASTNode, Kinds } from "../../../../node";
import { getErrorResult, getResult, mergeError } from "../../../../result";

export interface PartialCallNode extends ASTNode {
  kind: Kinds.call;
  left?: ExpressionNode;
  arguments: TupleNode;
}

export interface CallNode extends PartialCallNode {
  left: ExpressionNode;
}

export function parseCall(tokens: Token[]): ParseResult<PartialCallNode> {
  if(haveTokens(tokens, Tokens.open_round)) {
    const tupleResult = parseTuple(tokens.slice(1));
    if(tupleResult.value && haveTokens(tupleResult.context, Tokens.close_round)) {
      return getResult(tupleResult.context.slice(1), {
        kind: Kinds.call,
        arguments: tupleResult.value
      });
    } else {
      return mergeError(tupleResult, getParseError(Kinds.call, tokens[0].location));
    }
  } else {
    return getErrorResult(tokens, Kinds.call);
  }
}
