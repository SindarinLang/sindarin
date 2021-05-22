#include <string>
#include <map>
#include <fstream>
using namespace std;

#include "tokens.hpp"

#ifndef LEXER_OPERATORS_H
#define LEXER_OPERATORS_H

// ...
static map<string, int> triples = {
  {"===", tok_equals},
  {"...", tok_destructure}
};

// == <= >= ?? != => -> <-
static map<string, int> doubles = {
  {"==", tok_eq},
  {"<=", tok_lte},
  {">=", tok_gte},
  {"??", tok_default},
  {"!=", tok_neq},
  {"=>", tok_arrow},
  {"->", tok_forward},
  {"<-", tok_backward}
};

// ; + , - < > = : ? [ ] { } ( ) & | ^ * / . % !
static map<string, int> singles = {
  {"+", tok_add},
  {";", tok_semi},
  {",", tok_comma},
  {"-", tok_minus},
  {"<", tok_lt},
  {">", tok_gt},
  {"=", tok_init},
  {":", tok_colon},
  {"?", tok_question},
  {"[", tok_open_square},
  {"]", tok_close_square},
  {"{", tok_open_curly},
  {"}", tok_close_curly},
  {"(", tok_open_paren},
  {")", tok_close_paren},
  {"&", tok_and},
  {"|", tok_or},
  {"^", tok_carrot},
  {"*", tok_multiply},
  {"/", tok_divide},
  {".", tok_dot},
  {"%", tok_modulus},
  {"!", tok_not},
};

#endif

static Token getOperator(fstream& file) {
  string match;
  match.append(1, file.get());
  match.append(1, file.get());
  match.append(1, file.get());

  map<string, int>::const_iterator pos = triples.find(match);
  if(pos != triples.end()) {
    return {
      pos->second,
    };
  } else {
    match.pop_back();
    file.unget();
    pos = doubles.find(match);
    if(pos != doubles.end()) {
      return {
        pos->second,
      };
    } else {
      match.pop_back();
      file.unget();
      pos = singles.find(match);
      if(pos != singles.end()) {
        return {
          pos->second,
        };
      } else {
        file.unget();
        return {
          tok_invalid
        };
      }
    }
  }
}
