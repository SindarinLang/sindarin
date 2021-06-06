import { Phase, Result } from "..";
import { getError } from "../error";
import { FileLocation, locationToString } from "../reader";
import { Tokens, ScanValue } from "../scanner";
import { StatementNode, parseStatements } from "./statement";
import { ASTNode, Kinds } from "./node";
import { getErrorResult, getResult, mergeError } from "./result";
import { ItemsOf } from "../../../utils";

export interface RootNode extends ASTNode {
  kind: Kinds.root;
  value: StatementNode[];
}

export type AST = RootNode;

export type ParseValue = AST;

export type ParsePhase<T extends ASTNode> = Phase<ScanValue, T>;

export type ParseResult<T extends ASTNode> = Result<ParsePhase<T>>;

export type ParserNodes<P extends ParsePhase<ASTNode>[]> = NonNullable<Result<ItemsOf<P>>["value"]>;

const tokenFilter: Tokens[] = [
  Tokens.single_line_comment,
  Tokens.multi_line_comment,
  Tokens.space,
  Tokens.newline
];

export const getParseError = (kind: Kinds | string, location: FileLocation, message?: string) => {
  return getError("Parse")(`Could not parse ${kind}${message ? ` - ${message} ` : ""} (${locationToString(location)})`);
};

export const parse: ParsePhase<RootNode> = (tokens: ScanValue) => {
  const statementsResult = parseStatements(tokens.filter((token) => !tokenFilter.includes(token.kind)));
  if(statementsResult.value === undefined) {
    return getErrorResult(tokens, Kinds.root);
  } else if(statementsResult.context.length > 0) {
    return mergeError(statementsResult, getParseError(Kinds.root, tokens[0].location));
  } else {
    return getResult(statementsResult.context, {
      kind: Kinds.root,
      value: statementsResult.value.value
    });
  }
};

export * from "./node";
