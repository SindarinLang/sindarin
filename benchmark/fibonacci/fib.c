#include <stdio.h>

unsigned long fib(unsigned long n) {
  if(n<=1) {
    return n;
  } else {
    return fib(n-1) + fib(n-2);
  }
}

int main() {
  unsigned long n = 42;
  printf("%ld\n", fib(n));
  return 0;
}
