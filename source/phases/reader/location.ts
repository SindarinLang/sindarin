
export type FileLocation = {
  path: string;
  line: number;
  char: number;
};

export function locationToString({ path, line, char }: FileLocation) {
  return `${path}:${line}:${char}`;
}

export function getLocation(path: string, line = 1, char = 0) {
  return {
    path,
    line,
    char
  };
}
