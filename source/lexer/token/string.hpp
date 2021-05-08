#include <string>
#include <fstream>
using namespace std;

#include "tokens.hpp"

static Token getString(fstream& file)  {
  int letter = file.get(); // '"'
  string value = "";
  while((letter = file.get()) != '"') {
    value += letter;
  }
  return {
    tok_string,
    value
  };
}
