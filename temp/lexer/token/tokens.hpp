#include <string>
using namespace std;

#ifndef LEXER_TOKENS_H
#define LEXER_TOKENS_H

struct Token {
  int code;
  string value;
};

enum Tokens {
  tok_invalid = -1,
  tok_eof,
  tok_from,
  tok_import,
  tok_return,
  tok_export,
  tok_identifier,
  tok_true,
  tok_false,
  tok_undefined,
  tok_infinity,
  tok_number,
  tok_string,
  tok_equals,
  tok_eq,
  tok_lte,
  tok_gte,
  tok_neq,
  tok_default,
  tok_arrow,
  tok_forward,
  tok_backward,
  tok_destructure,
  tok_semi,
  tok_add,
  tok_comma,
  tok_minus,
  tok_multiply,
  tok_divide,
  tok_lt,
  tok_gt,
  tok_init,
  tok_colon,
  tok_question,
  tok_open_square,
  tok_close_square,
  tok_open_paren,
  tok_close_paren,
  tok_open_curly,
  tok_close_curly,
  tok_and,
  tok_or,
  tok_carrot,
  tok_modulus,
  tok_not,
  tok_dot
};

#endif 
