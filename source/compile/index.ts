import { createCommand } from "commander-version";
import { runPhases } from "./phase";

export type Options = {
  verbose?: boolean;
};

export function compileAction(entry: string, options: Options) {
  runPhases(entry, options);
}

export const compile = createCommand("compile")
  .description("Compile files from an entry point")
  .arguments("<entry>")
  .option("--verbose", "Verbose output")
  .action(compileAction);
