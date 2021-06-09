export { compile, compileCommand, compileAction } from "./compile";
export { run, runCommand, runAction } from "./run";

export type CLIOptions = {
  /**
   * Path to output. Default: `true`.
   */
  output?: string;
  /**
   * Prevent all logging. Default: `true`.
   */
  silent?: boolean;
  /**
   * Use verbose logging. Default: `false`.
   */
  verbose?: boolean;
};
