import { ReturnValue, Tokens } from "./";

export function search(
  file: string,
  stop: (letter: string, history: string[]) => boolean,
  type: Tokens | ((value: string) => Tokens),
  trim = false
): ReturnValue {
  let i=0;
  let value = "";
  while(i<file.length && !stop(file[i], file.substring(0, i).split("").reverse())) {
    value += file[i];
    i+=1;
  }
  return {
    file: file.substring(i + (trim ? 1 : 0)),
    token: {
      type: typeof type === "function" ? type(value): type,
      value
    }
  };
}
