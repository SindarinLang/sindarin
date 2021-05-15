import { Token, Tokens } from "../../../lex";
import { ParseResult } from "../../";
import { NumberNode, parseNumber } from "./number";
import { StringNode, parseString } from "./string";
import { BooleanNode, parseBoolean } from "./boolean";
import { UndefinedNode, parseUndefined } from "./undefined";
import { ExpressionNode, parseExpression } from "./expression";
import { isOperator } from "./expression/operator";
import { GroupNode, parseGroup } from "./group";
import { IdentifierNode, parseIdentifier } from "./identifier";
import { ArrayNode, parseArray } from "./array";
import { parseStruct, StructNode } from "./struct";
import { FunctionNode, parseFunction } from "./function";
import { VoidNode } from "./void";
import { Kinds } from "../../node";

export type ValueKind =
  | Kinds.boolean
  | Kinds.number
  | Kinds.string
  | Kinds.undefined
  | Kinds.expression
  | Kinds.group
  | Kinds.identifier
  | Kinds.array
  | Kinds.struct
  | Kinds.function;

export type ValueNode =
  | BooleanNode
  | NumberNode
  | StringNode
  | UndefinedNode
  | ExpressionNode
  | GroupNode
  | IdentifierNode
  | ArrayNode
  | StructNode
  | FunctionNode
  | VoidNode; // TODO: call arguments, path
  // FunctionNode
  // - ParameterNode
  // - BodyNode
  // SetNode a = { "b", "c" };

function getValueKind(tokens: Token[]): ValueKind {
  if(tokens[0].type === Tokens.open_paren) {
    return Kinds.group;
  } else if(tokens[0].type === Tokens.open_square) {
    return Kinds.array;
  } else if(tokens[0].type === Tokens.open_curly) {
    return Kinds.struct;
  } else if(tokens[1] && isOperator(tokens[1].type)) {
    return Kinds.expression;
  } else if(tokens[0].type === Tokens.number || tokens[0].type === Tokens.infinity) {
    return Kinds.number;
  } else if(tokens[0].type === Tokens.string) {
    return Kinds.string;
  } else if(tokens[0].type === Tokens.true || tokens[0].type === Tokens.false) {
    return Kinds.boolean;
  } else if(tokens[0].type === Tokens.undefined) {
    return Kinds.undefined;
  } else if(tokens[0].type === Tokens.identifier) {
    return Kinds.identifier;
  } else {
    throw new Error("syntax error");
  }
}

const valueParsers = {
  [Kinds.boolean]: parseBoolean,
  [Kinds.number]: parseNumber,
  [Kinds.string]: parseString,
  [Kinds.undefined]: parseUndefined,
  [Kinds.expression]: parseExpression,
  [Kinds.group]: parseGroup,
  [Kinds.identifier]: parseIdentifier,
  [Kinds.array]: parseArray,
  [Kinds.struct]: parseStruct,
  [Kinds.function]: parseFunction
};

export function parseValue(tokens: Token[]): ParseResult<ValueNode> {
  const kind = getValueKind(tokens);
  return valueParsers[kind](tokens);
}
