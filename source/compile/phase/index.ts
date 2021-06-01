import { logErrors, PhaseError } from "../error";
import { Options } from "../";
import { resolve } from "./resolver";
import { read } from "./reader";
import { scan } from "./scanner";
import { parse } from "./parser";
import { build } from "./builder";
import { write } from "./writer";

export type Phases =
  | "Resolve"
  | "Read"
  | "Scan"
  | "Parse"
  | "Build"
  | "Write";

export type PhaseResult<T = any> = {
  value: T | undefined;
  errors: PhaseError[];
};

export type Phase<C = any, T = any> = (context: C) => PhaseResult<T> | Promise<PhaseResult>;

export async function runPhase<C, T>(phase: Phase<C, T>, context: C | undefined, options: Options = {}): Promise<T | undefined> {
  if(options.verbose) {
    console.info(`${phase.name[0].toUpperCase()}${phase.name.substring(1)} Phase:`);
  }
  if(context !== undefined) {
    const result = await Promise.resolve(phase(context));
    if(result.errors.length > 0) {
      logErrors(result.errors);
      return undefined;
    } else {
      if(options.verbose) {
        console.info(result.value);
        console.info();
      }
      return result.value;
    }
  } else {
    return undefined;
  }
}

export async function runPhases(entry: string, options: Options) {
  const path = await runPhase(resolve, entry, options);
  const file = await runPhase(read, path, options);
  const tokens = await runPhase(scan, file, options);
  const ast = await runPhase(parse, tokens, options);
  const llvmFile = await runPhase(build, ast, options);
  return runPhase(write, llvmFile, options);
}
