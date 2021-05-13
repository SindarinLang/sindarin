import { Token, Tokens } from "../lex";

type TokenGroupList = Token[][];

function parseSV(tokens: Token[], separator: Tokens, end: Tokens) {
  const list: TokenGroupList = [[]];
  let pointer = 1; // skip opener
  while(tokens[pointer].type !== end) {
    if(tokens[pointer].type === separator) {
      list.push([]);
    } else {
      list[list.length-1].push(tokens[pointer]);
    }
    pointer+=1;
  }
  return {
    list,
    tokens: tokens.slice(pointer)
  };
}

function parseCSV(tokens: Token[], end: Tokens) {
  return parseSV(tokens, Tokens.comma, end);
}

function parseSSV(tokens: Token[], end: Tokens) {
  return parseSV(tokens, Tokens.semi, end);
}

// { a, b }
export function parseCurlyCSV(tokens: Token[]) {
  return parseCSV(tokens, Tokens.close_curly);
}

// [a, b]
export function parseSquareCSV(tokens: Token[]) {
  return parseCSV(tokens, Tokens.close_square);
}

// (a, b)
export function parseParenCSV(tokens: Token[]) {
  return parseCSV(tokens, Tokens.close_paren);
}

// { a; b; }
export function parseCurlySSV(tokens: Token[]) {
  return parseSSV(tokens, Tokens.close_curly);
}
