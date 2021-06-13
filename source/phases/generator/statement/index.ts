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
  buildExport,
  buildImport,
  buildReturn
];

export function buildStatement(file: LLVMFile, node: StatementNode) {
  builders.forEach((builder) => {
    builder(file, node);
  });
}
