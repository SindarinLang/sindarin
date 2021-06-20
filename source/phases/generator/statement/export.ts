import { isNode, Kinds, StatementNode } from "../../parser";
import { getSymbol, LLVMFile } from "../file";
import { isFunctionType } from "../types";
import { getFunction } from "./tuple/value/function";

export function buildExport(file: LLVMFile, node: StatementNode) {
  if(isNode(node, Kinds.export)) {
    if(node.from) {
      throw new Error("'from' exports not yet supported");
    } else {
      Object.keys(node.module.modules ?? {}).forEach((key) => {
        const symbol = getSymbol(file, key);
        file.exports[key] = (importer: LLVMFile) => {
          if(symbol?.type && isFunctionType(symbol.type)) {
            const symbolValue = {
              value: getFunction(importer, symbol.type),
              type: symbol.type
            };
            return () => symbolValue;
          } else {
            throw new Error("Importing non function type not implemented");
          }
        };
      });
    }
  }
}
