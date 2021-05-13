import { ASTNode } from "../../..";
import { IdentifierNode } from "../identifier";

export const parametersKind = "parameters";

export type ParametersKind = typeof parametersKind;

export interface ParametersNode extends ASTNode {
  kind: ParametersKind;
  value: IdentifierNode[];
}
