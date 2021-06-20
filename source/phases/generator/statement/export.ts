import { isNode, Kinds, StatementNode } from "../../parser";
import { getSymbol, LLVMFile } from "../file";
import { isFunctionType, SymbolValue } from "../types";
import { getFunction } from "./tuple/value/function";

export function buildExport(file: LLVMFile, node: StatementNode) {
  if(isNode(node, Kinds.export)) {
    if(node.from) {
      throw new Error("'from' exports not yet supported");
    } else {
      Object.keys(node.module.modules ?? {}).forEach((key) => {
        const symbols = getSymbol(file, key);
        file.exports[key] = (importer: LLVMFile) => {
          return symbols.map((value) => {
            if(isFunctionType(value.type)) {
              return {
                value: getFunction(importer, value.type),
                type: value.type
              };
            } else {
              return undefined;
            }
          }).filter((x) => x !== undefined) as SymbolValue[];
        };
      });
    }
  }
}
