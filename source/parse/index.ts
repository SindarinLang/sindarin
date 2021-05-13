import { parseRoot, RootKind, RootNode } from "./root";
import { Token, Tokens } from "../lex";
import { assignKind, AssignKind, ValueKind } from "./root/assign";
import { InvalidKind } from "./root/invalid";
import { ExportKind, FromKind, importKind, ImportKind, moduleKind, ModuleKind } from "./root/modules";
import { VoidKind } from "./root/value/void";
import { ParametersKind } from "./root/value/function/parameters";
import { ReturnKind } from "./root/value/function/return";
import { OperatorKind } from "./root/value/expression/operator";
import { argumentsKind, ArgumentsKind } from "./root/value/identifier/arguments";
import { pathKind, PathKind } from "./root/value/identifier/path";
import { TypeKind } from "./root/assign/type";
import { identifierKind } from "./root/value/identifier";
import { numberKind } from "./root/value/number";

export const nodeKinds = {
  PathKind: pathKind,
  AssignKind: assignKind,
  ImportKind: importKind,
  ModuleKind: moduleKind,
  IdentifierKind: identifierKind,
  ArgumentsKind: argumentsKind,
  NumberKind: numberKind
};

export type ASTNodeKind =
  | ModuleKind
  | ImportKind
  | ExportKind
  | FromKind
  | AssignKind
  | ValueKind
  | InvalidKind
  | RootKind
  | VoidKind
  | ParametersKind
  | ReturnKind
  | OperatorKind
  | ArgumentsKind
  | PathKind
  | TypeKind;

export type ASTNode = {
  kind: ASTNodeKind;
};

export type ParseResult<T = ASTNode> = {
  node: T;
  tokens: Token[];
};

export type Parser<T = ASTNode> = (tokens: Token[]) => ParseResult<T>;

const tokenFilter = [
  Tokens.space,
  Tokens.single_comment,
  Tokens.multi_comment
];

export function parse(tokens: Token[]) {
  const filteredTokens = tokens.filter((token) => !tokenFilter.includes(token.type));
  return parseRoot(filteredTokens).node;
}

export type AST = RootNode;
