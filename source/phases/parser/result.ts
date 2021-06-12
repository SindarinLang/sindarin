import { PhaseError } from "../error";
import { Token } from "../scanner";
import { getParseError, ParsePhase, ParseResult } from ".";
import { ASTNode, Kinds } from "./node";

export function getErrorResult<T extends ASTNode>(context: Token[], kind: Kinds | string, message?: string): ParseResult<T> {
  return {
    context,
    value: undefined,
    errors: [
      getParseError(kind, context[0]?.location, message)
    ]
  };
}

export function mergeError<T extends ASTNode, S extends ASTNode>(result: ParseResult<S>, error: PhaseError): ParseResult<T> {
  return {
    context: result.context,
    value: undefined,
    errors: [
      error,
      ...result.errors
    ]
  };
}

export function getResult<T extends ASTNode>(context: Token[], value: T) {
  return {
    context,
    value,
    errors: []
  };
}

export function getResultFrom<T extends ASTNode>(tokens: Token[], parsers: ParsePhase<T>[]): ParseResult<T> {
  const result: ParseResult<T> = {
    context: tokens,
    value: undefined,
    errors: []
  };
  for(let i=0; i<parsers.length; i+=1) {
    const parseResult = parsers[i](tokens);
    if(parseResult.value) {
      return parseResult;
    } else {
      result.errors.concat(...parseResult.errors);
    }
  }
  return result;
}
