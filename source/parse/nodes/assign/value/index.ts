import { Token, Tokens } from "../../../../lex";
import { ParseResult } from "../../..";
import { NumberNode, parseNumber, numberKind } from "./number";
import { StringNode, parseString, stringKind } from "./string";
import { BooleanNode, parseBoolean, booleanKind } from "./boolean";
import { UndefinedNode, parseUndefined, undefinedKind } from "./undefined";
import { ExpressionNode, parseExpression, expressionKind } from "./expression";
import { isOperator } from "./expression/operator";
import { groupKind, GroupNode, parseGroup } from "./group";
import { identifierKind, IdentifierNode, parseIdentifier } from "./identifier";
import { VoidNode } from "./void";
import { arrayKind, ArrayNode, parseArray } from "./array";
import { parseStruct, structKind, StructNode } from "./struct";

type ValueKind =
  | typeof booleanKind
  | typeof numberKind
  | typeof stringKind
  | typeof undefinedKind
  | typeof expressionKind
  | typeof groupKind
  | typeof identifierKind
  | typeof arrayKind
  | typeof structKind;

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
  | VoidNode; // TODO: call arguments, path
  // FunctionNode
  // - ParameterNode
  // - BodyNode
  // SetNode
  // EnumNode

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
  [structKind]: parseStruct
};

export function parseValue(tokens: Token[]): ParseResult<ValueNode> {
  const kind = getValueKind(tokens);
  return valueParsers[kind](tokens);
}
