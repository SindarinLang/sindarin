import { AssignNode } from "../../assign";
import { ASTNode, ParseResult } from "../../../";
import { ParametersNode } from "./parameters";
import { ReturnNode } from "./return";
import { Token } from "../../../../lex";
import { Kinds } from "../../../node";

export interface FunctionNode extends ASTNode {
  kind: Kinds.function;
  parameters: ParametersNode;
  body: AssignNode[];
  return: ReturnNode;
}

export function parseFunction(tokens: Token[]): ParseResult<FunctionNode> {
  return {
    tokens,
    node: {
      kind: Kinds.function
    }
  };
}
