mod token;

pub use token::Token;

/**
 * Keywords are check before operators.
 * This means that operators cannot start with a keyword, with the exception of "==".
 * However, an operator can contain a keyword, if that keyword is in the operator list.
 */

static KEYWORDS: &[(&str, fn() -> Token)] = &[
  // Triples
  // ("\"\"\"", || Token::TripleDoubleQuote),
  // ("'''", || Token::TripleSingleQuote),
  // ("```", || Token::TripleBacktick),
  // Doubles
  ("::", || Token::DoubleColon),
  ("=>", || Token::Arrow),
  ("->", || Token::Forward),
  ("~>", || Token::Async),
  ("  ", || Token::Tab),
  // Singles
  (":", || Token::Colon),
  (";", || Token::Semi),
  (",", || Token::Comma),
  ("[", || Token::OpenSquare),
  ("]", || Token::CloseSquare),
  ("{", || Token::OpenCurly),
  ("}", || Token::CloseCurly),
  ("(", || Token::OpenParens),
  (")", || Token::CloseParens),
  // ("\"", || Token::DoubleQuote),
  // ("'", || Token::SingleQuote),
  // ("`", || Token::Backtick),
  ("=", || Token::Assign),
  ("~", || Token::Await),
  ("@", || Token::Link),
  (" ", || Token::Space),
  ("\n", || Token::Newline)
];

static OPERATORS: &[char] = &[
  '+', '-', '*', '/', '%', '^', '&', '|', '!', '?', '<', '>', '=', '~', '.'
];

fn lex_single_line_comment(context: &str) -> Option<(Vec<Token>, usize)> {
  if context.starts_with("// ") {
    let text = context[2..].split("\n").next().unwrap();
    let len = text.len() + 3; // account for "// "
    let tokens = Vec::from([Token::SingleLineComment(text.to_string())]);
    return Some((tokens, len));
  }
  None
}

fn lex_multi_line_comment(context: &str) -> Option<(Vec<Token>, usize)> {
  if context.starts_with("/*") {
    let comment_end = context[1..].find("*/").unwrap_or_else(|| context.len());
    let comment = &context[1..=comment_end]; // include "*/"
    let len = comment.len() + 4; // account for "/*" + "*/"
    let tokens = Vec::from([Token::MultiLineComment(comment.to_string())]);
    return Some((tokens, len));
  }
  None
}

fn lex_block(mut context: &str) -> (Vec<Token>, usize) {
  let mut tokens = Vec::new();
  let mut len = 0;
  if context.starts_with("{") {
    tokens.push(Token::OpenCurly);
    len += 1;
    context = &context[1..];
    while !context.is_empty() && !context.starts_with("}") {
      let (new_tokens, new_len) = lex_tokens(context);
      context = &context[new_len..];
      tokens.extend(new_tokens);
      len += new_len;
    }
    tokens.push(Token::CloseCurly);
    len += 1;
  }
  (tokens, len)
}

fn get_text_len(context: &str, closing: &str) -> Option<usize> {
  let chars: Vec<_> = context.chars().collect();
  let mut previous_char = None;
  for (i, &c) in chars.iter().enumerate() {
    if (c == '{' && previous_char != Some('\\')) || c == closing.chars().next().unwrap() {
      return Some(i);
    }
    previous_char = Some(c);
  }
  None
}

fn unescape(s: &str) -> String {
  let mut result = String::with_capacity(s.len());
  let mut chars = s.chars();
  while let Some(ch) = chars.next() {
    if ch == '\\' {
      match chars.next() {
        Some('n') => result.push('\n'),
        Some('r') => result.push('\r'),
        Some('t') => result.push('\t'),
        Some('\\') => result.push('\\'),
        Some('"') => result.push('"'),
        Some('\'') => result.push('\''),
        _ => {}
      }
    } else {
      result.push(ch);
    }
  }
  result
}


fn lex_text(mut context: &str, closing: &str) -> (Vec<Token>, usize) {
  let mut tokens = Vec::new();
  let mut len = 0;
  while !context.is_empty() && !context.starts_with(closing) {
    if context.starts_with("{") {
      let (block_tokens, block_len) = lex_block(context);
      context = &context[block_len..];
      tokens.extend(block_tokens);
      len += block_len;
    } else {
      let mut text = String::new();
      while let Some(c) = context.chars().next() {
        if context.starts_with(closing) || context.starts_with('{') {
          break;
        } else {
          context = &context[1..];
          len += 1;
          if c == '\\' {
            match context.chars().next() {
              Some(next) => {
                context = &context[1..];
                len += 1;
                match next {
                  '0' => text.push('\0'),    // 0x00 - Null
                  'b' => text.push('\u{8}'), // 0x08 - Backspace
                  't' => text.push('\t'),    // 0x09 - Horizontal Tab
                  'n' => text.push('\n'),    // 0x0A - Line Feed
                  'v' => text.push('\u{B}'), // 0x0B - Vertical Tab
                  'f' => text.push('\u{C}'), // 0x0C - Form Feed
                  'r' => text.push('\r'),    // 0x0D - Carriage Return
                  _ => {
                    text.push(next);
                  }
                }
              },
              None => {
                text.push('\\');
                break;
              }
            };
          } else {
            text.push(c);
          }
        }
      }
      // let text_len = get_text_len(context, closing).unwrap_or_else(|| context.len());
      // let text = context[..text_len].to_string();

      let token = Token::Text(text);
      // context = &context[text_len..];
      tokens.push(token);
      // len += text_len;
    }
  }
  (tokens, len)
}

fn lex_char(context: &str) -> Option<(Vec<Token>, usize)> {
  if context.starts_with("'") {
    let mut tokens = Vec::from([Token::SingleQuote]);
    let (inner_tokens, len) = lex_text(&context[1..], "'");
    tokens.extend(inner_tokens);
    tokens.push(Token::SingleQuote);
    return Some((tokens, len + 2));
  }
  None
}

fn lex_string(context: &str) -> Option<(Vec<Token>, usize)> {
  if context.starts_with("\"") {
    let mut tokens = Vec::from([Token::DoubleQuote]);
    let (inner_tokens, len) = lex_text(&context[1..], "\"");
    tokens.extend(inner_tokens);
    tokens.push(Token::DoubleQuote);
    return Some((tokens, len + 2));
  }
  None
}

fn is_binary(c: char) -> bool {
  c == '0' || c == '1'
}

fn is_octal(c: char) -> bool {
  c as u8 >= 0x30 && c as u8 <= 0x37
}

fn is_operator(c: char) -> bool {
  OPERATORS.contains(&c)
}

fn lex_number(context: &str) -> Option<(Vec<Token>, usize)> {
  if let Some(first_char) = context.chars().next() {
    if first_char.is_ascii_digit() {
      if first_char == '0' {
        if let Some(second_char) = context.chars().nth(1) {
          if second_char == 'x' {
            let hex_end = context[2..].find(|c: char| !c.is_ascii_hexdigit()).unwrap_or_else(|| context[2..].len());
            let hex = &context[2..hex_end+2];
            let len = hex.len() + 2;
            return Some((vec![Token::Hex(hex.to_string())], len));
          } else if second_char == 'o' {
            let octal_end = context[2..].find(|c: char| !is_octal(c)).unwrap_or_else(|| context[2..].len());
            let octal = &context[2..octal_end+2];
            let len = octal.len() + 2;
            return Some((vec![Token::Octal(octal.to_string())], len));
          } else if second_char == 'b' {
            let binary_end = context[2..].find(|c: char| !is_binary(c)).unwrap_or_else(|| context[2..].len());
            let binary = &context[2..binary_end+2];
            let len = binary.len() + 2;
            return Some((vec![Token::Binary(binary.to_string())], len));
          }
        }
      }
      let mut has_dot = false;
      let number_end = context.find(|c: char| {
        let result = !c.is_ascii_digit() && c != '_' && ((c == '.' && has_dot) || c != '.');
        if c == '.' {
          has_dot = true;
        }
        return result;
      }).unwrap_or_else(|| context.len());
      let number = &context[..number_end];
      let len = number.len();
      if has_dot {
        return Some((vec![Token::Decimal(number.to_string())], len));
      } else {
        return Some((vec![Token::Integer(number.to_string())], len));
      }
    }
  }
  None
}

fn lex_capital_identifier(context: &str) -> Option<(Vec<Token>, usize)> {
  if let Some(first_char) = context.chars().next() {
    if first_char.is_ascii_uppercase() {
      let name_end = context.find(|c: char| !c.is_alphanumeric() && c != '_').unwrap_or_else(|| context.len());
      let name = &context[..name_end];
      let len = name.len();
      return Some((vec![Token::CapitalIdentifier(name.to_string())], len));
    }
  }
  None
}

fn lex_lowercase_identifier(context: &str) -> Option<(Vec<Token>, usize)> {
  if let Some(first_char) = context.chars().next() {
    if first_char.is_ascii_lowercase() {
      let name_end = context.find(|c: char| !c.is_alphanumeric() && c != '_').unwrap_or_else(|| context.len());
      let name = &context[..name_end];
      let len = name.len();
      return Some((vec![Token::LowercaseIdentifier(name.to_string())], len));
    }
  }
  None
}

fn lex_operator(context: &str) -> Option<(Vec<Token>, usize)> {
  if let Some(first_char) = context.chars().next() {
    if first_char.is_ascii_punctuation() {
      let name_end = context.find(|c: char| !is_operator(c)).unwrap_or_else(|| context.len());
      let name = &context[..name_end];
      let len = name.len();
      return Some((vec![Token::Operator(name.to_string())], len));
    }
  }
  None
}

fn lex_keyword(context: &str) -> Option<(Vec<Token>, usize)> {
  for &(pattern, token_fn) in KEYWORDS {
    if context.starts_with(&pattern) && !context.starts_with("==") {
      return Some((Vec::from([token_fn()]), pattern.len()));
    }
  }
  None
}

fn lex_unknown(context: &str) -> Option<(Vec<Token>, usize)> {
  Some((Vec::from([Token::Unknown(context.chars().next().unwrap().to_string())]), 1))
}

fn lex_tokens(context: &str) -> (Vec<Token>, usize) {
  lex_single_line_comment(context)
    .or_else(|| lex_multi_line_comment(context))
    .or_else(|| lex_capital_identifier(context))
    .or_else(|| lex_lowercase_identifier(context))
    .or_else(|| lex_number(context))
    .or_else(|| lex_char(context))
    .or_else(|| lex_string(context))
    .or_else(|| lex_keyword(context))
    .or_else(|| lex_operator(context))
    .or_else(|| lex_unknown(context))
    .unwrap()
}

pub fn tokenize(mut contents: &str) -> Vec<Token> {
  let mut tokens = Vec::new();
  while !contents.is_empty() {
    let (new_tokens, len) = lex_tokens(contents);
    // Update the contents slice to start after the consumed token.
    contents = &contents[len..];
    tokens.extend(new_tokens);
  }
  tokens
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn test_basic() {
    let tokens = tokenize("1 + 2");
    assert_eq!(tokens, vec![
      Token::Integer("1".to_string()),
      Token::Space,
      Token::Operator("+".to_string()),
      Token::Space,
      Token::Integer("2".to_string()),
    ]);
  }

  #[test]
  fn test_operators() {
    let tokens = tokenize("= == -%= ...");
    assert_eq!(tokens, vec![
      Token::Assign,
      Token::Space,
      Token::Operator("==".to_string()),
      Token::Space,
      Token::Operator("-%=".to_string()),
      Token::Space,
      Token::Operator("...".to_string())
    ]);
  }

  #[test]
  fn test_numbers() {
    let tokens = tokenize("0x0F 0o07 0b10 0.123 1_000_000");
    assert_eq!(tokens, vec![
      Token::Hex("0F".to_string()),
      Token::Space,
      Token::Octal("07".to_string()),
      Token::Space,
      Token::Binary("10".to_string()),
      Token::Space,
      Token::Decimal("0.123".to_string()),
      Token::Space,
      Token::Integer("1_000_000".to_string())
    ])
  }

  #[test]
  fn test_string_unescape() {
    let tokens = tokenize("\"Hello, \\\" \\{ \\x world!\"");
    assert_eq!(tokens, vec![
      Token::DoubleQuote,
      Token::Text("Hello, \" { x world!".to_string()),
      Token::DoubleQuote
    ]);
  }
  #[test]
  fn test_string_template() {
    let tokens = tokenize("\"Hello, {name}!\"");
    assert_eq!(tokens, vec![
      Token::DoubleQuote,
      Token::Text("Hello, ".to_string()),
      Token::OpenCurly,
      Token::LowercaseIdentifier("name".to_string()),
      Token::CloseCurly,
      Token::Text("!".to_string()),
      Token::DoubleQuote
    ])
  }
}
