import { ParseResult } from "..";
import { haveTokens, Token, Tokens } from "../../scanner";
import { ASTNode, Kinds } from "../node";
import { parseTuple, TupleNode } from "./tuple";

export interface ReturnNode extends ASTNode {
  kind: Kinds.return;
  value: TupleNode;
}

export function parseReturn(tokens: Token[]): ParseResult<ReturnNode> {
  if(haveTokens(tokens, Tokens.return)) {
    const tupleResult = parseTuple(tokens.slice(1));
    if(tupleResult) {
      return {
        tokens: tupleResult.tokens,
        node: {
          kind: Kinds.return,
          value: tupleResult.node
        }
      };
    } else {
      throw new Error("Syntax error");
    }
  } else {
    return undefined;
  }
}
