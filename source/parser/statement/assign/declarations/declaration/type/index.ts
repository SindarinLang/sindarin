import { ASTNode, Kinds } from "../../../../../node";

export interface TypeNode extends ASTNode {
  kind: Kinds.type;
  value: string; // Boolean, Float, Integer
}
