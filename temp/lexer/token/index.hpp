#include <string>
#include <fstream>
using namespace std;

#include "tokens.hpp"
#include "string.hpp"
#include "number.hpp"
#include "identifiers.hpp"
#include "operators.hpp"

static Token getToken(fstream& file);

static Token getEOF(fstream& file) {
  file.get();
  return {
    tok_eof
  };
}

static Token getSingleLineComment(fstream& file) {
  int letter;
  do {
    letter = file.get(); // second '/' in "//"
  } while (letter != EOF && letter != '\n' && letter != '\r');
  file.unget();
  return getToken(file);
}

static Token getMultiLineComment(fstream& file) {
  int letter;
  do {
    letter = file.get(); // '*' in "/*"
  } while(letter != EOF && !(letter == '*' && file.peek() == '/'));
  if(letter == EOF) {
    file.unget();
  } else {
    file.get();
  }
  return getToken(file);
}

static Token getToken(fstream& file) {
  // Skip any whitespace.
  while(isspace(file.peek())) {
    file.get();
  }

  char letter = file.peek();

  if(letter == EOF) {
    return getEOF(file);
  } else if(letter == '"') {
    return getString(file);
  } else if(isalpha(letter)) {
    return getIdentifier(file);
  } else if(isdigit(letter)) {
    return getNumber(file);
  } else if(letter == '/') {
    file.get();
    if(file.peek() == '/') {
      return getSingleLineComment(file);
    } else if(file.peek() == '*') {
      return getMultiLineComment(file);
    } else {
      return {
        tok_divide
      };
    }
  } else {
    return getOperator(file);
  }
}
