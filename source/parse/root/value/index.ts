import { Token, Tokens } from "../../../lex";
import { ParseResult } from "../../";
import { NumberNode, parseNumber, numberKind, NumberKind } from "./number";
import { StringNode, parseString, stringKind, StringKind } from "./string";
import { BooleanNode, parseBoolean, booleanKind, BooleanKind } from "./boolean";
import { UndefinedNode, parseUndefined, undefinedKind, UndefinedKind } from "./undefined";
import { ExpressionNode, parseExpression, expressionKind, ExpressionKind } from "./expression";
import { isOperator } from "./expression/operator";
import { GroupKind, groupKind, GroupNode, parseGroup } from "./group";
import { IdentifierKind, identifierKind, IdentifierNode, parseIdentifier } from "./identifier";
import { ArrayKind, arrayKind, ArrayNode, parseArray } from "./array";
import { parseStruct, StructKind, structKind, StructNode } from "./struct";
import { functionKind, FunctionKind, FunctionNode, parseFunction } from "./function";
import { VoidNode } from "./void";

export type ValueKind =
  | BooleanKind
  | NumberKind
  | StringKind
  | UndefinedKind
  | ExpressionKind
  | GroupKind
  | IdentifierKind
  | ArrayKind
  | StructKind
  | FunctionKind;

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
    return groupKind;
  } else if(tokens[0].type === Tokens.open_square) {
    return arrayKind;
  } else if(tokens[0].type === Tokens.open_curly) {
    return structKind;
  } else if(tokens[1] && isOperator(tokens[1].type)) {
    return expressionKind;
  } else if(tokens[0].type === Tokens.number || tokens[0].type === Tokens.infinity) {
    return numberKind;
  } else if(tokens[0].type === Tokens.string) {
    return stringKind;
  } else if(tokens[0].type === Tokens.true || tokens[0].type === Tokens.false) {
    return booleanKind;
  } else if(tokens[0].type === Tokens.undefined) {
    return undefinedKind;
  } else if(tokens[0].type === Tokens.identifier) {
    return identifierKind;
  } else {
    throw new Error("syntax error");
  }
}

const valueParsers = {
  [booleanKind]: parseBoolean,
  [numberKind]: parseNumber,
  [stringKind]: parseString,
  [undefinedKind]: parseUndefined,
  [expressionKind]: parseExpression,
  [groupKind]: parseGroup,
  [identifierKind]: parseIdentifier,
  [arrayKind]: parseArray,
  [structKind]: parseStruct,
  [functionKind]: parseFunction
};

export function parseValue(tokens: Token[]): ParseResult<ValueNode> {
  const kind = getValueKind(tokens);
  return valueParsers[kind](tokens);
}
