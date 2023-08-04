use std::fmt::{self, Debug, Formatter};

#[derive(PartialEq, Eq)]
pub enum Token {
  // Comments
  SingleLineComment(String),
  MultiLineComment(String),
  // Names
  CapitalIdentifier(String),
  LowercaseIdentifier(String),
  // Values
  Hex(String),
  Integer(String),
  Decimal(String),
  Octal(String),
  Binary(String),
  Text(String),
  // Separators
  Colon,
  DoubleColon,
  Semi,
  Comma,
  // Brackets
  OpenSquare,
  CloseSquare,
  OpenCurly,
  CloseCurly,
  OpenParens,
  CloseParens,
  // Quotes
  DoubleQuote,
  SingleQuote,
  Backtick,
  TripleDoubleQuote,
  TripleSingleQuote,
  TripleBacktick,
  // Operators
  Arrow,   // =>
  Forward, // ->
  Assign,  // =
  Async,   // ~>
  Await,   // ~
  Link,    // @
  Operator(String),
  // Whitespace
  Tab,
  Space,
  Newline,
  // Other
  Unknown(String)
}

impl Debug for Token {
  fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
    match self {
      Token::SingleLineComment(comment) => write!(f, "SingleLineComment({})", comment),
      Token::MultiLineComment(comment) => write!(f, "MultiLineComment({})", comment),
      Token::CapitalIdentifier(name) => write!(f, "CapitalIdentifier({})", name),
      Token::LowercaseIdentifier(name) => write!(f, "LowercaseIdentifier({})", name),
      Token::Hex(number) => write!(f, "Hex({})", number),
      Token::Integer(number) => write!(f, "Integer({})", number),
      Token::Decimal(number) => write!(f, "Decimal({})", number),
      Token::Octal(number) => write!(f, "Octal({})", number),
      Token::Binary(number) => write!(f, "Binary({})", number),
      Token::Text(text) => write!(f, "Text({})", text),
      Token::Colon => write!(f, "Colon"),
      Token::DoubleColon => write!(f, "DoubleColon"),
      Token::Semi => write!(f, "Semi"),
      Token::Comma => write!(f, "Comma"),
      Token::OpenSquare => write!(f, "OpenSquare"),
      Token::CloseSquare => write!(f, "CloseSquare"),
      Token::OpenCurly => write!(f, "OpenCurly"),
      Token::CloseCurly => write!(f, "CloseCurly"),
      Token::OpenParens => write!(f, "OpenParens"),
      Token::CloseParens => write!(f, "CloseParens"),
      Token::DoubleQuote => write!(f, "DoubleQuote"),
      Token::SingleQuote => write!(f, "SingleQuote"),
      Token::Backtick => write!(f, "Backtick"),
      Token::TripleDoubleQuote => write!(f, "TripleDoubleQuote"),
      Token::TripleSingleQuote => write!(f, "TripleSingleQuote"),
      Token::TripleBacktick => write!(f, "TripleBacktick"),
      Token::Arrow => write!(f, "Arrow"),
      Token::Forward => write!(f, "Forward"),
      Token::Assign => write!(f, "Assign"),
      Token::Async => write!(f, "Async"),
      Token::Await => write!(f, "Await"),
      Token::Link => write!(f, "Link"),
      Token::Operator(op) => write!(f, "Operator({})", op),
      Token::Tab => write!(f, "Tab"),
      Token::Space => write!(f, "Space"),
      Token::Newline => write!(f, "Newline"),
      Token::Unknown(unknown) => write!(f, "Unknown({})", unknown)
    }
  }
}
