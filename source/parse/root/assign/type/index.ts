import { ASTNode } from "../../..";

const typeKind = "type";

export type TypeKind = typeof typeKind;

export interface TypeNode extends ASTNode {
  kind: TypeKind;
}
