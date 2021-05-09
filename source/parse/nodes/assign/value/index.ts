import { Token, Tokens } from "../../../../lex";
import { ParseResult, ASTNode } from "../../..";
import { NumberNode, parseNumber, numberKind } from "./number";
import { StringNode, parseString, stringKind } from "./string";
import { BooleanNode, parseBoolean, booleanKind } from "./boolean";
import { UndefinedNode, parseUndefined, undefinedKind } from "./undefined";

type ValueKind =
  | typeof booleanKind
  | typeof numberKind
  | typeof stringKind
  | typeof undefinedKind;

export type ValueNode =
  | BooleanNode
  | NumberNode
  | StringNode
  | UndefinedNode;

function getValueKind(tokens: Token[]): ValueKind {
  if(tokens[0].type === Tokens.number || tokens[0].type === Tokens.infinity) {
    return numberKind;
  } else if(tokens[0].type === Tokens.string) {
    return stringKind;
  } else if(tokens[0].type === Tokens.true || tokens[0].type === Tokens.false) {
    return booleanKind;
  } else if(tokens[0].type === Tokens.undefined) {
    return undefinedKind;
  } else {
    throw new Error("syntax error");
  }
}

const valueParsers = {
  [booleanKind]: parseBoolean,
  [numberKind]: parseNumber,
  [stringKind]: parseString,
  [undefinedKind]: parseUndefined
};

export function parseValue(tokens: Token[]): ParseResult<ValueNode> {
  const kind = getValueKind(tokens);
  return valueParsers[kind](tokens);
}
