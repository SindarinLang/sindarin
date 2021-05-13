import { AssignNode } from "../../assign";
import { ASTNode, ParseResult } from "../../../";
import { ParametersNode } from "./parameters";
import { ReturnNode } from "./return";
import { Token } from "../../../../lex";

export const functionKind = "function";

export type FunctionKind = typeof functionKind;

export interface FunctionNode extends ASTNode {
  kind: FunctionKind;
  parameters: ParametersNode;
  body: AssignNode[];
  return: ReturnNode;
}

export function parseFunction(tokens: Token[]): ParseResult<FunctionNode> {
  return {
    tokens,
    node: {
      kind: functionKind
    }
  };
}
