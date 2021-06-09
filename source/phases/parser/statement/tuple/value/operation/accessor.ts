import { getParseError, ParseResult } from "../../../..";
import { Token, haveTokens, Tokens } from "../../../../../scanner";
import { ASTNode, Kinds } from "../../../../node";
import { parseValue, UnaryOperandNode } from "..";
import { ExpressionNode } from "../..";
import { getErrorResult, getResult, mergeError } from "../../../../result";

export interface PartialAccessorNode extends ASTNode {
  kind: Kinds.accessor;
  left?: ExpressionNode;
  right: UnaryOperandNode;
}

export interface AccessorNode extends PartialAccessorNode {
  left: ExpressionNode;
}

export function parseAccessor(tokens: Token[]): ParseResult<PartialAccessorNode> {
  if(haveTokens(tokens, Tokens.dot)) {
    const valueResult = parseValue(tokens.slice(1));
    if(valueResult.value) {
      return getResult(valueResult.context, {
        kind: Kinds.accessor,
        right: valueResult.value
      });
    } else {
      return mergeError(valueResult, getParseError(Kinds.accessor, tokens[0].location));
    }
  } else {
    return getErrorResult(tokens, Kinds.accessor);
  }
}
