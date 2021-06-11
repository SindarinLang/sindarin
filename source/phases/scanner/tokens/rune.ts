import GraphemeSplitter from "grapheme-splitter";
import { getScanError, ScanPhase } from "..";
import { getEnum } from "../../../utils";
import { ReadValue } from "../../reader";
import { getEscapeCharacter } from "../escape-sequences";
import { getResult } from "../result";

export type RuneTokens = keyof typeof RuneTokens;

export const RuneTokens = getEnum({
  rune: true
});

const singleQuote = "'";

const splitter = new GraphemeSplitter();

export const getRuneToken: ScanPhase = (file: ReadValue) => {
  if(file.contents[0] === singleQuote) {
    const escapeCharacter = getEscapeCharacter(file.contents.substring(1));
    if(escapeCharacter) {
      return getResult(file, RuneTokens.rune, `${singleQuote}${escapeCharacter.raw}${singleQuote}`, escapeCharacter.value);
    } else {
      const split = splitter.splitGraphemes(file.contents.substring(1));
      if(split[1] === singleQuote) {
        return getResult(file, RuneTokens.rune, `${singleQuote}${split[0]}${singleQuote}`, split[0]);
      } else {
        return {
          context: file,
          value: undefined,
          errors: [
            getScanError("Invalid rune", file.location)
          ]
        };
      }
    }
  } else {
    return {
      context: file,
      value: undefined,
      errors: [
        getScanError("Missing single quote", file.location)
      ]
    };
  }
};

