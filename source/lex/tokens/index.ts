import { isQuote, isAlpha, isNotDecimal, isNotAlphaNumeric, isNewline, isStarSlash, isSpace, isDigit, isCapitalized } from "./char";
import { search } from "./search";

// eslint-disable-next-line no-shadow
export enum Tokens {
  invalid,
  from,
  import,
  return,
  export,
  identifier,
  type,
  true,
  false,
  undefined,
  infinity,
  integer,
  float,
  string,
  eq,
  lte,
  gte,
  neq,
  default,
  arrow,
  forward,
  backward,
  destruct,
  semi,
  add,
  comma,
  subtract,
  multiply,
  divide,
  lt,
  gt,
  assign,
  colon,
  question,
  open_square,
  close_square,
  open_paren,
  close_paren,
  open_curly,
  close_curly,
  and,
  or,
  carrot,
  modulus,
  not,
  dot,
  single_comment,
  multi_comment,
  space,
  mutable
}

export type Token = {
  type: Tokens;
  value: string;
};

export type ReturnValue = {
  token: Token;
  file: string;
};

type TokenMap = {
  [value: string]: Tokens;
};

const identifiers: TokenMap = {
  from: Tokens.from,
  import: Tokens.import,
  export: Tokens.export,
  return: Tokens.return,
  true: Tokens.true,
  false: Tokens.false,
  undefined: Tokens.undefined,
  infinity: Tokens.infinity
};

const triples: TokenMap = {
  "...": Tokens.destruct
};

const doubles: TokenMap = {
  "==": Tokens.eq,
  "<=": Tokens.lte,
  ">=": Tokens.gte,
  "??": Tokens.default,
  "!=": Tokens.neq,
  "=>": Tokens.arrow,
  "->": Tokens.forward,
  "<-": Tokens.backward
};

const singles: TokenMap = {
  "+": Tokens.add,
  ";": Tokens.semi,
  ",": Tokens.comma,
  "-": Tokens.subtract,
  "<": Tokens.lt,
  ">": Tokens.gt,
  "=": Tokens.assign,
  ":": Tokens.colon,
  "?": Tokens.question,
  "[": Tokens.open_square,
  "]": Tokens.close_square,
  "{": Tokens.open_curly,
  "}": Tokens.close_curly,
  "(": Tokens.open_paren,
  ")": Tokens.close_paren,
  "&": Tokens.and,
  "|": Tokens.or,
  "^": Tokens.carrot,
  "*": Tokens.multiply,
  "/": Tokens.divide,
  ".": Tokens.dot,
  "%": Tokens.modulus,
  "!": Tokens.not,
  "~": Tokens.mutable
};

export function getToken(file: string): ReturnValue {
  const letter = file[0];
  if(isSpace(letter)) {
    return {
      file: file.substring(1),
      token: {
        type: Tokens.space,
        value: file[0]
      }
    };
  } else if(isQuote(letter)) {
    return search(file.substring(1), isQuote, Tokens.string, true);
  } else if(isAlpha(letter)) {
    return search(file, isNotAlphaNumeric, (value: string) => {
      return identifiers[value] ?? (
        isCapitalized(value) ? Tokens.type : Tokens.identifier
      );
    });
  } else if(isDigit(letter)) {
    const result = search(file, isNotDecimal, Tokens.integer);
    if(result.token.value.includes(".")) {
      result.token.type = Tokens.float;
    }
    return result;
  } else if(letter === "/" && file.length > 1 && file[1] === "/") {
    return search(file.slice(2), isNewline, Tokens.single_comment);
  } else if(letter === "/" && file.length > 1 && file[1] === "*") {
    return search(file.slice(2), isStarSlash, Tokens.multi_comment, true);
  } else if(triples[file.substring(0, 3)]) {
    return {
      file: file.substring(3),
      token: {
        type: triples[file.substring(0, 3)],
        value: file.substring(0, 3)
      }
    };
  } else if(doubles[file.substring(0, 2)]) {
    return {
      file: file.substring(2),
      token: {
        type: doubles[file.substring(0, 2)],
        value: file.substring(0, 2)
      }
    };
  } else if(singles[file.substring(0, 1)]) {
    return {
      file: file.substring(1),
      token: {
        type: singles[file.substring(0, 1)],
        value: file.substring(0, 1)
      }
    };
  } else {
    return {
      file: file.substring(1),
      token: {
        type: Tokens.invalid,
        value: file.substring(0, 1)
      }
    };
  }
}
