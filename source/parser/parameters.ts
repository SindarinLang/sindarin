import { haveTokens, Token, Tokens } from "../lexer";
import { ASTNode, Kinds } from "./node";
import { AssignmentNode, parseAssign } from "./statement/assignment";
import { SpreadNode, parseSpread } from "./spread";
import { Parser, ParseResult } from ".";
import { ListNode, parseCommaList } from "./list";
import { parseVoid, VoidNode } from "./statement/tuple/void";

export interface ParametersNode extends ASTNode {
  kind: Kinds.parameters;
  value: ListNode<AssignmentNode | SpreadNode | VoidNode>;
}

const parsers: Parser<AssignmentNode | SpreadNode | VoidNode>[] = [
  parseAssign,
  parseSpread,
  parseVoid
];

export function parseParameters(tokens: Token[]): ParseResult<ParametersNode> {
  const listResult = parseCommaList(tokens, parsers);
  if(listResult && !haveTokens(listResult.tokens, Tokens.semi)) {
    return {
      tokens: listResult.tokens,
      node: {
        kind: Kinds.parameters,
        value: listResult.node
      }
    };
  } else {
    return undefined;
  }
}
