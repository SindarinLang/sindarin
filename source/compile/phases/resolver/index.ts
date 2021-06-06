import { Phase, Result, Options } from "..";
import { getError } from "../error";
import { resolveExact } from "./strategies/exact";
import { resolveExtension } from "./strategies/extension";
import { resolveIndex } from "./strategies/index";
import { resolveRelative } from "./strategies/relative";

export type ResolveValue = string[];

export type ResolvePhase = Phase<string, ResolveValue>;

export type ResolveResult = Result<ResolvePhase>;

export type ResolveOptions = {
  strategies: {
    /**
     * Resolve with an exact match. Default: true
     */
    exact: boolean;
    /**
     * Resolve with path relative to working directory. Default: true
     */
    relative: boolean;
    /**
     * Resolve by adding the `.si` extension. Default: true
     */
    extension: boolean;
    /**
     * Resolve by adding `index.si`. Default: true
     */
    index: boolean;
    /**
     * Resolve from sindarin.json alias. Default: true
     */
    // alias: boolean;
    /**
     * Resolve from a URL. Default: true
     */
    // http: boolean;
  }
};

type Strategy = keyof ResolveOptions["strategies"];

const strategies: {
  [key in Strategy]: ResolvePhase;
} = {
  exact: resolveExact,
  relative: resolveRelative,
  extension: resolveExtension,
  index: resolveIndex
};

export const extension = ".si";

export const getResolveError = getError("Resolve");

export const resolve: ResolvePhase = (from: string, options?: Options) => {
  const result: ResolveResult = {
    context: from,
    value: [],
    errors: []
  };
  for(let i=0; i<Object.keys(strategies).length; i+=1) {
    const strategy = (Object.keys(strategies) as Strategy[])[i];
    if(options?.resolver?.strategies[strategy] !== false) {
      const next = strategies[strategy](from);
      if(next.value) {
        result.value?.push(...next.value);
      } else {
        result.errors.push(...next.errors);
      }
    }
  }
  return result;
};
