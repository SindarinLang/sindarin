#include <string>
#include <map>
#include <fstream>
using namespace std;

#include "tokens.hpp"

#ifndef LEXER_IDENTIFIERS_H
#define LEXER_IDENTIFIERS_H

static map<string, int> identifiers = {
  {"from", tok_from},
  {"import", tok_import},
  {"export", tok_export},
  {"return", tok_return},
  {"true", tok_true},
  {"false", tok_false},
  {"undefined", tok_undefined},
  {"infinity", tok_infinity}
};

#endif

static Token getIdentifier(fstream& file) {
  string value = "";
  while(isalnum(file.peek())) {
    value += file.get();
  }
  map<string, int>::const_iterator pos = identifiers.find(value);
  if(pos == identifiers.end()) {
    return {
      tok_identifier,
      value
    };
  } else {
    return {
      pos->second,
      value
    };
  }
}
