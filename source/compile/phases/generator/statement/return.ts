import llvm from "llvm-bindings";
import { isNode, Kinds } from "../../parser/node";
import { StatementNode } from "../../parser/statement";
import { LLVMFile, SymbolValue } from "../file";
import { buildTuple } from "./tuple";

export function getReturn(file: LLVMFile, value: llvm.Value) {
  return file.builder.CreateRet(value);
}

export function buildReturn(file: LLVMFile, node: StatementNode) {
  if(isNode(node, Kinds.return)) {
    const value = buildTuple(file, node.value);
    getReturn(file, (value[0] as SymbolValue).value);
  }
}
