import { haveTokens, Token, Tokens } from "../../../../scanner";
import { getParseError, ParsePhase, ParseResult, ParserNodes } from "../../..";
import { getErrorResult, getResult, getResultFrom, mergeError } from "../../../result";
import { parseNull } from "./null";
import { parseArray } from "./array";
import { parseStruct } from "./struct";
import { parseBoolean } from "./boolean";
import { parseNumberValue } from "./number";
import { parseString } from "./string";
import { parseIdentifier } from "./identifier";
import { parseFunction } from "./function";
import { parseValueOperation, ValueOperationNode } from "./operation";
import { parseTuple, TupleNode } from "..";
import { parseRune } from "./rune";

export type ValueNode = ParserNodes<typeof valueParsers>;

export type UnaryOperandNode = ValueNode | ValueOperationNode | TupleNode;

const valueParsers = [
  parseArray,
  parseStruct,
  parseNull,
  parseBoolean,
  parseNumberValue,
  parseString,
  parseRune,
  parseIdentifier,
  parseFunction
];

function getValueOperation(left: ParseResult<UnaryOperandNode>): ParseResult<UnaryOperandNode> {
  const valueOperationResult = parseValueOperation(left.context);
  if(valueOperationResult.value) {
    valueOperationResult.value.left = left.value;
    if(valueOperationResult.value.left) {
      return getValueOperation(valueOperationResult as ParseResult<UnaryOperandNode>);
    } else {
      return left;
    }
  } else {
    return left;
  }
}

export const parseValue: ParsePhase<UnaryOperandNode> = (tokens: Token[]) => {
  const result = getResultFrom<ValueNode>(tokens, valueParsers);
  if(result.value) {
    return getValueOperation(result);
  } else if(haveTokens(tokens, Tokens.open_round)) {
    const tupleResult = parseTuple(tokens.slice(1));
    if(tupleResult.value && haveTokens(tupleResult.context, Tokens.close_round)) {
      return getValueOperation(getResult(tupleResult.context.slice(1), tupleResult.value));
    } else {
      return mergeError(tupleResult, getParseError("Value", tokens[0].location));
    }
  } else {
    return getErrorResult(tokens, "Value");
  }
};
