import { AssignNode } from "../..";
import { ASTNode } from "../../../..";
import { ParametersNode } from "./parameters";
import { ReturnNode } from "./return";

export const functionKind = "function";

export interface FunctionNode extends ASTNode {
  kind: typeof functionKind;
  parameters: ParametersNode;
  body: AssignNode[];
  return: ReturnNode;
}
