import { isToken, Token, Tokens } from "../../../scanner";
import { ModuleNode, parseModules } from "./module";
import { FromNode } from "./from";
import { ASTNode, Kinds } from "../../node";
import { getParseError, ParsePhase } from "../..";
import { getErrorResult, mergeError } from "../../result";

export interface ExportNode extends ASTNode {
  kind: Kinds.export;
  module: ModuleNode;
  from?: FromNode;
}

export const parseExport: ParsePhase<ExportNode> = (tokens: Token[]) => {
  if(isToken(tokens[0], Tokens.export)) {
    const result = parseModules(tokens.slice(1));
    if(result.value) {
      return {
        context: result.context,
        value: {
          kind: Kinds.export,
          module: result.value
        },
        errors: []
      };
    } else {
      return mergeError(result, getParseError(Kinds.import, tokens[0].location));
    }
  } else {
    return getErrorResult(tokens, Kinds.import, "missing export keyword");
  }
};
