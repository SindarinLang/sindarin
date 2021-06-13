import { TupletNode, isNode, Kinds } from "../../../../parser";
import { LLVMFile } from "../../../file";
import { SymbolValue } from "../../../types";
import { buildInteger } from "./integer";
import { buildBoolean } from "./boolean";
import { buildIdentifier } from "./identifier";
// import { buildNull } from "./null";
import { buildCall } from "./call";
import { buildAccessor } from "./accessor";
import { buildBinaryOperation } from "./binary-operation";
import { buildUnaryOperation } from "./unary-operation";
import { buildFunction } from "./function";
import { buildTuple } from "..";
import { buildRune } from "./rune";

export type ValueBuilder = (file: LLVMFile, node: any) => SymbolValue[];

export const getBuilders: () => {
  [key: string]: ValueBuilder;
} = () => ({
  [Kinds.boolean]: buildBoolean,
  [Kinds.number]: buildInteger,
  [Kinds.identifier]: buildIdentifier,
  [Kinds.binaryOperation]: buildBinaryOperation,
  [Kinds.unaryOperation]: buildUnaryOperation,
  [Kinds.call]: buildCall,
  [Kinds.accessor]: buildAccessor,
  [Kinds.function]: buildFunction,
  [Kinds.rune]: buildRune
});

export function buildValue(file: LLVMFile, node: TupletNode): SymbolValue[] {
  const builders = getBuilders();
  if(builders[node.kind]) {
    return builders[node.kind](file, node);
  } else if(isNode(node, Kinds.tuple)) {
    return buildTuple(file, node)[0];
  } else {
    throw new Error(`Unsupported value for kind '${node.kind}'`);
  }
}
