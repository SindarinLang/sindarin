import { createCommand } from "commander-version";
import { CLIOptions } from "./";
import { createAction } from "../utils";
import {
  runPhase,
  resolve,
  read,
  scan,
  parse,
  generate,
  write,
  build
} from "../phases";


export async function compile(entry: string, options: CLIOptions = {}) {
  const paths = runPhase(resolve, entry, options);
  const file = await runPhase(read, paths, options);
  const tokens = runPhase(scan, file, options);
  const ast = runPhase(parse, tokens, options);
  const llvmFile = await runPhase(generate, ast, options);
  const dir = await runPhase(write, llvmFile, options);
  return runPhase(build, dir, options);
}

export const compileAction = createAction(compile);

export const compileCommand = createCommand("compile")
  .description("Compile files from an entry point")
  .arguments("<entry>")
  .option("-o --output", "Path to output")
  .option("-s --silent", "Prevent all logging", false)
  .option("--verbose", "Use verbose logging")
  .action(compileAction);
