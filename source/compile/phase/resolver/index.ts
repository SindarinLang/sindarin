import { getError } from "../../error";
import { Phase, PhaseResult } from "..";
import { resolveExact } from "./strategies/exact";
import { resolveExtension } from "./strategies/extension";
import { resolveIndex } from "./strategies/index";
import { resolveRelative } from "./strategies/relative";

export type ResolveResult = PhaseResult<string>;
export type ResolvePhase = Phase<string, string>;

type Options = {
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

type Strategy = keyof Options["strategies"];

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

export const resolve: ResolvePhase = async (from: string, options?: Options) => {
  const result: ResolveResult = {
    value: undefined,
    errors: []
  };
  for(let i=0; i<Object.keys(strategies).length; i+=1) {
    const strategy = (Object.keys(strategies) as Strategy[])[i];
    if(options?.strategies[strategy] !== false) {
      // eslint-disable-next-line no-await-in-loop
      const next = await strategies[strategy](from);
      if(next.value) {
        return next;
      } else {
        result.errors.push(...next.errors);
      }
    }
  }
  return result;
};
