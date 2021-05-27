
type RawTokenLocation = {
  path: string;
  line: number;
  char: number;
};

export type TokenLocation = RawTokenLocation & {
  toString: () => string;
};

export function getLocation(location: RawTokenLocation) {
  return {
    ...location,
    toString: () => `(${location.path}:${location.line}:${location.char})`
  };
}
