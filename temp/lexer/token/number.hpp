#include <string>
#include <fstream>
using namespace std;

#include "tokens.hpp"

static Token getNumber(fstream& file) {
  string value = "";
  while(isdigit(file.peek()) || file.peek() == '.') {
    value += file.get();
  }
  return {
    tok_number,
    value
  };
}
