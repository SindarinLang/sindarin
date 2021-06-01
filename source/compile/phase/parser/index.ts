import { StatementNode, parseStatements } from "./statement";
import { Token, Tokens } from "../scanner";
import { ASTNode, Kinds } from "./node";
import { ListNode } from "./list";
import { Phase } from "..";
import { getError } from "../../error";

export type ParseResult<T = ASTNode> = {
  node: T;
  tokens: Token[];
} | undefined;

export type Parser<T = ASTNode> = (tokens: Token[]) => ParseResult<T>;

export type ParserNodes<T extends Array<
  (tokens: Token[]) => ParseResult<ASTNode>
>> = NonNullable<ReturnType<T[number]>>["node"];

const tokenFilter: Tokens[] = [
  Tokens.single_line_comment,
  Tokens.multi_line_comment,
  Tokens.space,
  Tokens.newline
];

export type AST = RootNode;

export interface RootNode extends ASTNode {
  kind: Kinds.root;
  value: ListNode<StatementNode>;
}

export const getParseError = getError("Parse");

export const parse: Phase<Token[], AST> = (tokens: Token[]) => {
  const statementsResult = parseStatements(tokens.filter((token) => !tokenFilter.includes(token.kind)));
  if(statementsResult && statementsResult.tokens.length > 0) {
    return {
      value: {
        kind: Kinds.root,
        value: statementsResult.node
      },
      errors: []
    };
  } else {
    return {
      value: undefined,
      errors: [
        getParseError("Syntax error")
      ]
    };
  }
};
