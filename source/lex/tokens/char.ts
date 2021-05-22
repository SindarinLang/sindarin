
type Letter = number | string;

export function isCapitalized(word: string) {
  return word.charAt(0).toUpperCase() === word.charAt(0);
}

function toCharCode(letter: string) {
  return letter.charCodeAt(0);
}

function convertChar(fn: (code: Letter) => boolean) {
  return (letter: Letter) => {
    const code = typeof letter === "number" ? letter : toCharCode(letter);
    return fn(code);
  };
}

const is = (letter: string) => convertChar((code) => {
  return code === toCharCode(letter);
});

export const isDot = is(".");

export const isSpace = (letter: string) => is(" ")(letter) || is("\n")(letter);

export const isQuote = is('"');

export const isNewline = is("\n");

export const isStar = is("*");

export const isSlash = is("/");

export const isStarSlash = (letter: Letter, [last]: Letter[]) => {
  return last !== undefined && isStar(last) && isSlash(letter);
};

const isLowerAlpha = convertChar((code: Letter) => {
  return code >= 97 && code <= 122;
});

const isUpperAlpha = convertChar((code: Letter) => {
  return code >= 65 && code <= 90;
});

export const isDigit = convertChar((code: Letter) => {
  return code >= 48 && code <= 57;
});

export const isAlpha = convertChar((code: Letter) => {
  return isLowerAlpha(code) || isUpperAlpha(code);
});

export const isAlphaNumeric = convertChar((code: Letter) => {
  return isAlpha(code) || isDigit(code);
});

export const isDecimal = convertChar((code: Letter) => {
  return isDigit(code) || isDot(code);
});

export const isNotAlphaNumeric = (letter: Letter) => !isAlphaNumeric(letter);

export const isNotDecimal = (letter: Letter) => !isDecimal(letter);


