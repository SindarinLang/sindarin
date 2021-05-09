import { Tokens, getToken, Token } from "./tokens";

export function lex(source: string) {
  const tokens: Token[] = [];
  let file = source;
  while(file.length > 0) {
    const result = getToken(file);
    file = result.file;
    tokens.push(result.token);
  }
  return tokens;
}

export {
  Token,
  Tokens
};
