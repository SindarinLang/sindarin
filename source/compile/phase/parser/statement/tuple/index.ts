import { Parser, ParseResult } from "../..";
import { Token } from "../../../scanner";
import { ListNode, parseCommaList } from "../../list";
import { ASTNode, Kinds } from "../../node";
import { ExpressionNode, parseExpression } from "./expression";
import { parseVoid, VoidNode } from "./void";

export interface TupleNode extends ASTNode {
  kind: Kinds.tuple;
  value: ListNode<ExpressionNode | VoidNode>;
}

const parsers: Parser<ExpressionNode | VoidNode>[] = [
  parseExpression,
  parseVoid
];

export function parseTuple(tokens: Token[]): ParseResult<TupleNode> {
  const listResult = parseCommaList(tokens, parsers);
  if(listResult) {
    return {
      tokens: listResult.tokens,
      node: {
        kind: Kinds.tuple,
        value: listResult.node
      }
    };
  } else {
    return undefined;
  }
}
