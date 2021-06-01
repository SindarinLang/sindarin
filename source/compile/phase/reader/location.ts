
export type FileLocation = {
  path: string;
  line: number;
  char: number;
  toString: () => string;
};

export function getLocation(path: string, line = 1, char = 0) {
  return {
    path,
    line,
    char,
    toString: () => `${path}:${line}:${char}`
  };
}
