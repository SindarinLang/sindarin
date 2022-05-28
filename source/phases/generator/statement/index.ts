import { allSeries } from "../../../utils";
import { StatementNode } from "../../parser";
import { LLVMFile } from "../file";
import { buildAssign } from "./assign";
import { buildExport } from "./export";
import { buildImport } from "./import";
import { buildReturn } from "./return";
import { buildTuple } from "./tuple";

const builders = [
  buildAssign,
  buildTuple,
  buildReturn
];

const rootBuilders: ((file: LLVMFile, node: StatementNode) => void | Promise<void>)[] = [
  buildImport,
  buildExport,
  ...builders
];

export function buildRootStatement(file: LLVMFile, node: StatementNode) {
  return allSeries(rootBuilders.map((builder) => () => builder(file, node)));
}

export function buildStatement(file: LLVMFile, node: StatementNode) {
  builders.forEach((builder) => {
    builder(file, node);
  });
}
