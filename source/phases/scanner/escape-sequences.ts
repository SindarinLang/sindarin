
const escapeSequences = {
  "\\0": "\0", // 0x00 - Null
  "\\b": "\b", // 0x08 - Backspace
  "\\t": "\t", // 0x09 - Horizontal Tab
  "\\n": "\n", // 0x0A - Line Feed
  "\\v": "\v", // 0x0B - Vertical Tab
  "\\f": "\f", // 0x0C - Form Feed
  "\\r": "\r", // 0x0D - Carriage Return
  "`": "\"", // 0x22 - Double Quote
  "\\\"": "\"", // 0x22 - Double Quote
  "\\'": "'", // 0x27 - Single Quote
  "\\\\": "\\", // 0x5C - Backslash
  "\\`": "`", // 0x60 - Grave Accent
  "\\{": "{" // 0x7B - Opening Brace
};

export function getEscapeCharacter(string: string) {
  const match = (Object.keys(escapeSequences) as (keyof typeof escapeSequences)[]).find((key) => {
    return string.startsWith(key);
  });
  if(match) {
    return {
      raw: string.substring(0, match.length),
      value: escapeSequences[match]
    };
  } else {
    return undefined;
  }
}
