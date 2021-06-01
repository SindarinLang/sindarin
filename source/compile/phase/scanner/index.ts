import { Phase } from "..";
import { getError } from "../../error";
import { File } from "../reader";
import { Context, haveContent } from "./context";
import { getToken, Tokens, Token, isToken, isTokenIn, haveTokens, haveTokensIn } from "./tokens";

type ScanPhase = Phase<File, Token[]>;

const getScanError = getError("Scan");

export const scan: ScanPhase = (file: File) => {
  let context: Context = {
    file,
    tokens: []
  };
  while(haveContent(context)) {
    const next = getToken(context);
    if(next === undefined) {
      return {
        value: context.tokens,
        errors: [
          getScanError("Invalid token", context?.file.location)
        ]
      };
    } else {
      context = next;
    }
  }
  return {
    value: context.tokens,
    errors: []
  };
};

export {
  Token,
  Tokens,
  isToken,
  isTokenIn,
  haveTokens,
  haveTokensIn
};
