import { ASTNode } from "../../../..";
import { IdentifierNode } from "../identifier";

export const parametersKind = "parameters";

export interface ParametersNode extends ASTNode {
  kind: typeof parametersKind;
  value: IdentifierNode[];
}
