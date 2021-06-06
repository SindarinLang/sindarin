import isPromise from "is-promise";
import { PromiseValue } from "../../utils";
import { Options } from "..";
import { resolve } from "./resolver";
import { read } from "./reader";
import { scan } from "./scanner";
import { parse } from "./parser";
import { generate } from "./generator";
import { write } from "./writer";
import { logErrors, PhaseError } from "./error";

export type Phases =
  | "Resolve"
  | "Read"
  | "Scan"
  | "Parse"
  | "Build"
  | "Write";

type PhaseResult<C, T> = {
  context: C;
  value?: T;
  errors: PhaseError[];
};

export type Phase<C, T> = (context: C, options?: Options) => PhaseResult<C, T>;

export type PromisePhase<C, T> = (context: C, options?: Options) => Promise<PhaseResult<C, T>>;

export type Result<P extends Phase<C, T> | PromisePhase<C, T>, C=any, T=any> = P extends Phase<C, T> ? ReturnType<P> : PromiseValue<ReturnType<P>>;

function handleResult<C, T>(result: Result<Phase<C, T>>, options?: Options): T | undefined {
  if(result.errors.length > 0) {
    logErrors(result.errors);
    return result.value;
  } else {
    if(options?.verbose) {
      console.info(result.value);
    }
    return result.value;
  }
}

export function runPhase<C, O extends Options, T>(phase: Phase<C, T>, context: C | undefined, options: O): T | undefined;
export function runPhase<C, O extends Options, T>(phase: PromisePhase<C, T>, context: C | undefined, options: O): Promise<T | undefined> | undefined;
export function runPhase<C, O extends Options, T>(phase: Phase<C, T> | PromisePhase<C, T>, context: C | undefined, options: O): T | Promise<T | undefined> | undefined {
  if(options.verbose) {
    console.info(`${phase.name[0].toUpperCase()}${phase.name.substring(1)} Phase:`);
  }
  if(context === undefined) {
    return undefined;
  } else {
    const result = phase(context);
    if(isPromise(result)) {
      return new Promise((res) => {
        result.then((data) => res(handleResult(data, options)));
      });
    } else {
      return handleResult(result, options);
    }
  }
}

export async function runPhases(entry: string, options: Options) {
  const paths = runPhase(resolve, entry, options);
  const file = await runPhase(read, paths, options);
  const tokens = runPhase(scan, file, options);
  const ast = runPhase(parse, tokens, options);
  const llvmFile = runPhase(generate, ast, options);
  return runPhase(write, llvmFile, options);
}

export {
  Options
};
