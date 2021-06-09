import { createCommand } from "commander-version";
import { CLIOptions } from "./";
import { compile } from "./compile";
import { createAction } from "../utils";
import { runPhase, execute } from "../phases";

export async function run(entry: string, options: CLIOptions = {}) {
  const compileResult = await compile(entry, options);
  if(compileResult) {
    const executeResults = await runPhase(execute, compileResult, options);
    if(executeResults) {
      if(options.silent === false) {
        console.info(executeResults.stdout);
        console.error(executeResults.stderr);
      }
      return executeResults;
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
}

export const runAction = createAction(run);

export const runCommand = createCommand("run")
  .description("Run from an entry point")
  .arguments("<entry>")
  .option("-o --output", "Path to output")
  .option("-s --silent", "Prevent all logging", false)
  .option("--verbose", "Use verbose logging")
  .action(runAction);
