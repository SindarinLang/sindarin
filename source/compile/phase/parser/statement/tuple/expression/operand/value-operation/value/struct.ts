import { ParseResult } from "../../../../../..";
import { Token, haveTokens, Tokens } from "../../../../../../../scanner";
import { ASTNode, Kinds } from "../../../../../../node";
import { ParametersNode, parseParameters } from "../../../../../../parameters";

export interface StructNode extends ASTNode {
  kind: Kinds.struct;
  value: ParametersNode;
}

export function parseStruct(tokens: Token[]): ParseResult<StructNode> {
  if(haveTokens(tokens, Tokens.open_curly)) {
    const result = parseParameters(tokens.slice(1));
    if(result && haveTokens(result.tokens, Tokens.close_curly)) {
      return {
        tokens: result.tokens.slice(1),
        node: {
          kind: Kinds.struct,
          value: result.node
        }
      };
    } else {
      throw new Error("Syntax error");
    }
  } else {
    return undefined;
  }
}
