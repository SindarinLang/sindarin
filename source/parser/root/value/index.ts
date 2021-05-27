import { Token, Tokens } from "../../../lexer";
import { ParseResult } from "../..";
import { IntegerNode, FloatNode, parseFloatValue, parseIntegerValue } from "./number";
import { StringNode, parseString } from "./string";
import { BooleanNode, parseBoolean } from "./boolean";
import { UndefinedNode, parseUndefined } from "./undefined";
import { isOperator, OperatorNode, parseOperator } from "./operator";
import { parseGroup } from "./group";
import { IdentifierNode, parseIdentifier } from "./identifier";
import { ArrayNode, parseArray } from "./array";
import { parseStruct, StructNode } from "./struct";
import { FunctionNode, parseFunction } from "./function";
import { VoidNode } from "./void";
import { Kinds } from "../../node";

export type ValueKind =
  | Kinds.boolean
  | Kinds.integer
  | Kinds.float
  | Kinds.string
  | Kinds.undefined
  | Kinds.group
  | Kinds.identifier
  | Kinds.array
  | Kinds.struct
  | Kinds.function;

export type ValueNode =
  | BooleanNode
  | IntegerNode
  | FloatNode
  | StringNode
  | UndefinedNode
  | OperatorNode
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
  if(tokens[0].type === Tokens.open_round) {
    return Kinds.group;
  } else if(tokens[0].type === Tokens.open_square) {
    return Kinds.array;
  } else if(tokens[0].type === Tokens.open_curly) {
    return Kinds.struct;
  } else if(tokens[0].type === Tokens.integer) {
    return Kinds.integer;
  } else if(tokens[0].type === Tokens.float || tokens[0].type === Tokens.infinity) {
    return Kinds.float;
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

const valueParsers: {
  [key in ValueKind]: (tokens: Token[]) => ParseResult<ValueNode>
} = {
  [Kinds.boolean]: parseBoolean,
  [Kinds.integer]: parseIntegerValue,
  [Kinds.float]: parseFloatValue,
  [Kinds.string]: parseString,
  [Kinds.undefined]: parseUndefined,
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

function isEnd(tokens: Token[]) {
  return tokens[0].type === Tokens.semi || tokens[0].type === Tokens.close_round || tokens[0].type === Tokens.close_square;
}

export function parseExpression(tokens: Token[]): ParseResult<ValueNode> {
  let result = parseValue(tokens);
  while(!isEnd(result.tokens)) {
    if(isOperator(result.tokens[0].type)) {
      result = parseOperator(result.node, result.tokens);
    } else {
      throw new Error("Syntax error");
    }
  }
  return result;
}
