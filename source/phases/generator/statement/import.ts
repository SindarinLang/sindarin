import { isNode, Kinds, StatementNode } from "../../parser";
import { getCore } from "../core";
import { LLVMFile, setSymbol } from "../file";
import { include } from "../c3po";

const includes = [
  "<math.h>",
  "<stdio.h>",
  "<stdlib.h>"
];

export async function buildImport(file: LLVMFile, node: StatementNode) {
  if(isNode(node, Kinds.import)) {
    if(node.from) {
      if(includes.includes(node.from.source)) {
        await include(file, node.from.source, node.module);
      } else {
        throw new Error("'from' not fully implemented");
      }
    } else {
      const result = await getCore(node.module);
      const core = result.value;
      if(core) {
        Object.keys(node.module.modules ?? {}).forEach((key) => {
          if(core.exports[key]) {
            setSymbol(file, key, core.exports[key](file));
          } else {
            throw new Error(`Missing export ${key}`);
          }
        });
        file.imports.push(core);
      } else {
        console.error(result.errors);
        throw new Error("Could not load core");
      }
    }
  }
}
