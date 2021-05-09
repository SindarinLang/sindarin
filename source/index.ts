import { relative, join, extname } from "path";
import { fileExists } from "file-exists-safe";
import { readFile } from "read-file-safe";
import { lex } from "./lex";
import { parse } from "./parse";

async function resolvePath(path: string) {
  const file = extname(path) === "si" ? relative(process.cwd(), path) : join(relative(process.cwd(), path), "index.si");
  const exact = await fileExists(file);
  if(exact) {
    return file;
  } else {
    return undefined;
  }
}

if(process.argv.length < 3) {
  console.error("Not enough arguments");
} else {
  const entry = process.argv[2];
  resolvePath(entry).then(async (path) => {
    if(path === undefined) {
      console.error("Entry does not exist.");
    } else {
      const contents = await readFile(path) as string;
      const tokens = lex(contents);
      const ast = parse(tokens);
      console.log(JSON.stringify(ast, null, 2));
    }
  });
}

// read file from argv[1]
// lex -> tokens
// parse -> ast
// 
