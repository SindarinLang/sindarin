import { generate } from "..";
import { resolve, read, scan, parse } from "../..";
import { ModuleNode } from "../../parser";
import { LLVMFile, Export } from "../file";
import { output } from "./output";

const coreExports: {
  [name: string]: (exporter: LLVMFile) => Export;
} = {
  output
};

// TODO: only load functions in moduleNode
export async function getCore(moduleNode: ModuleNode) {
  const paths = resolve("./core/sindarin.si").value ?? [];
  const file = await read(paths);
  if(file.value) {
    const tokens = scan(file.value);
    if(tokens.value) {
      const ast = parse(tokens.value);
      if(ast.value) {
        const result = await generate(ast.value, { generator: { fileName: "sindarin" } });
        const exporter = result.value;
        if(exporter) {
          Object.keys(coreExports).forEach((key) => {
            exporter.exports[key] = coreExports[key](exporter);
          });
          return result;
        } else {
          console.error(result.errors);
          throw new Error("Could not import core");
        }
      } else {
        console.error(ast.errors);
        throw new Error("Could not parse core");
      }
    } else {
      console.error(tokens.errors);
      throw new Error("Could not scan core");
    }
  } else {
    console.error(file.errors);
    throw new Error("Could not read core");
  }
}
