import { Token, Tokens, isToken, haveTokens } from "../../../scanner";
import { parseImport, ImportNode } from "./import";
import { parseExport, ExportNode } from "./export";
import { ASTNode, Kinds } from "../../node";
import { getParseError, ParsePhase } from "../..";
import { getErrorResult, mergeError } from "../../result";

export interface FromNode extends ASTNode {
  kind: Kinds.from;
  source: string;
}

export const parseFrom: ParsePhase<ImportNode | ExportNode> = (tokens: Token[]) => {
  if(isToken(tokens[0], Tokens.from)) {
    if(haveTokens(tokens.slice(1), Tokens.open_quote, Tokens.string, Tokens.close_quote) && tokens[2].value) {
      const fromNode: FromNode = {
        kind: Kinds.from,
        source: tokens[2].value
      };
      if(isToken(tokens[4], Tokens.import)) {
        const result = parseImport(tokens.slice(4));
        if(result.value) {
          result.value.from = fromNode;
          return result;
        } else {
          return mergeError(result, getParseError(Kinds.from, tokens[0].location));
        }
      } else if(isToken(tokens[4], Tokens.export)) {
        const result = parseExport(tokens.slice(4));
        if(result.value) {
          result.value.from = fromNode;
          return result;
        } else {
          return mergeError(result, getParseError(Kinds.from, tokens[0].location));
        }
      } else {
        return getErrorResult(tokens, Kinds.from, "missing import or export");
      }
    } else {
      return getErrorResult(tokens, Kinds.from, "missing from string");
    }
  } else {
    return getErrorResult(tokens, Kinds.from, "missing from keyword");
  }
};
