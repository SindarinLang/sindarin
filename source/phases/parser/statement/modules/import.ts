import { haveTokens, Token, Tokens } from "../../../scanner";
import { ASTNode, Kinds } from "../../node";
import { getParseError, ParsePhase } from "../..";
import { ModuleNode, parseModules } from "./module";
import { FromNode } from "./from";
import { getErrorResult, mergeError } from "../../result";

export interface ImportNode extends ASTNode {
  kind: Kinds.import;
  module: ModuleNode;
  from?: FromNode;
}

export const parseImport: ParsePhase<ImportNode> = (tokens: Token[]) => {
  if(haveTokens(tokens, Tokens.import)) {
    const result = parseModules(tokens.slice(1));
    if(result.value) {
      return {
        context: result.context,
        value: {
          kind: Kinds.import,
          module: result.value
        },
        errors: []
      };
    } else {
      return mergeError(result, getParseError(Kinds.import, tokens[0].location));
    }
  } else {
    return getErrorResult(tokens, Kinds.import, "missing import keyword");
  }
};
