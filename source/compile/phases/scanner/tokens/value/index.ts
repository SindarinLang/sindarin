import { ScanPhase, Tokens } from "../..";
import { getEnum } from "../../../../../utils";
import { StringTokens } from "./string";
import { TokenMatchers, getMatch } from "../utils";
import { ReadValue } from "../../../reader";
import { Result } from "../../..";

export type ValueTokens = keyof typeof ValueTokens;

export const ValueTokens = getEnum({
  ...StringTokens,
  identifier: true,
  type: true,
  number: true
});

export function isValueToken(kind: Tokens): kind is ValueTokens {
  return ValueTokens[kind as ValueTokens] !== undefined;
}

const matchers: TokenMatchers<ValueTokens> = [{
  kind: ValueTokens.type,
  open: isUpper,
  while: isAlphaNumeric
}, {
  kind: ValueTokens.identifier,
  open: isLower,
  while: isAlphaNumeric
}, {
  kind: ValueTokens.number,
  open: isNumeric,
  while: isNumeric
}];

function isBetween(char: string, left: string, right: string) {
  const code = char.charCodeAt(0);
  return code >= left.charCodeAt(0) && code <= right.charCodeAt(0);
}

function isUpper(char: string) {
  return isBetween(char, "A", "Z");
}

function isLower(char: string) {
  return isBetween(char, "a", "z");
}

function isNumeric(char: string) {
  return isBetween(char, "0", "9");
}

function isAlpha(char: string) {
  return isUpper(char) || isLower(char);
}

function isAlphaNumeric(char: string) {
  return isAlpha(char) || isNumeric(char);
}

export function getValueToken(context: ReadValue): Result<ScanPhase> {
  return getMatch(context, matchers);
}
