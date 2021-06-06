import { Phase, Result } from "..";
import { getError } from "../error";
import { ReadValue, FileLocation, locationToString } from "../reader";
import { mergeResults } from "./result";
import { getToken, Tokens, Token, isToken, isTokenIn, haveTokens, haveTokensIn } from "./tokens";

export type ScanValue = Token[];

export type ScanPhase = Phase<ReadValue, ScanValue>;

export type ScanResult = Result<ScanPhase>;

export const getScanError = (message: string, location: FileLocation) => {
  return getError("Scan")(`${message} (${locationToString(location)})`);
};

export const scan: ScanPhase = (file: ReadValue) => {
  let result: ScanResult = {
    context: file,
    value: [],
    errors: []
  };
  while(result.context.contents.length > 0) {
    const next = getToken(result.context);
    if(next.value === undefined || next.value.length === 0) {
      return next;
    } else {
      result = mergeResults(result, next);
    }
  }
  return result;
};

export {
  Token,
  Tokens,
  isToken,
  isTokenIn,
  haveTokens,
  haveTokensIn
};
