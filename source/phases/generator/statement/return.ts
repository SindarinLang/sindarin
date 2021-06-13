import llvm from "llvm-bindings";
import { isNode, Kinds, StatementNode } from "../../parser";
import { LLVMFile } from "../file";
import { SymbolValue } from "../types";
import { buildTuple } from "./tuple";

export function getReturn(file: LLVMFile, symbols: SymbolValue[]): llvm.ReturnInst {
  return file.builder.CreateRet(symbols[0].value);
}

export function buildReturn(file: LLVMFile, node: StatementNode) {
  if(isNode(node, Kinds.return)) {
    const value = buildTuple(file, node.value);
    getReturn(file, value[0]);
  }
}
