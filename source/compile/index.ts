import { createCommand } from "commander-version";
import { runPhases } from "./phases";
import { ResolveOptions } from "./phases/resolver";

export type CLIOptions = {
  verbose?: boolean;
};

export type Options = CLIOptions & {
  resolver?: ResolveOptions;
};

export function compileAction(entry: string, options: CLIOptions) {
  runPhases(entry, options);
}

export const compile = createCommand("compile")
  .description("Compile files from an entry point")
  .arguments("<entry>")
  .option("--verbose", "Verbose output")
  .action(compileAction);
