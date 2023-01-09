# Functions

## Basics

### Parameterless Functions

Functions are defined without a keyword such as `fn` or `function`. The simplest functions have no parameters. The `@` operator is used to return a value:

```
getFive = {
  @5;
};
```

### Functions with Parameters

Functions can also have parameters:
```
increment = (a: Int32) => {
  @(a + 1);
};
```

### Inline Functions

We can combine these to call a function inline:
```
result = increment({
  @getFive();
});
```

### Function Types

Function types are declared with `=>`:
```
MyFnType = (a: Int32) => Int32;
```

#### Generic Function Types

Function types can also be generic:
```
MyGenericFnType = <T>(a: T) => T;
```

### Passing Functions as Parameters

Functions can also be passed as parameters:
```
callFn = (fn: MyFnType) => {
  @(fn(5));
};
```

## Partial Application

Arguments can be left unspecified, while "baking" others into a new function:
```
add = (a: Int32, b: Int32) => {
  @(a + b);
};

increment = add(1,); // (b: Int32) => Int32;
```

## Argument Forwarding

Argument Forwarding solves the problem of nested function arguments. For example:
```js
doC(doB(doA(x)));
```
Becomes:
```
doA(x)->doB->doC;
```

For longer chains this can also be wrapped:
```
doA(x)
  ->doB
  ->doC
  ->doD;
```

### Forwarding Operator

With the forward operator (`->`), functions snap together like Legos. The result of the first function is passed as the first argument to the next function:

```
add = (a: number, b: number) => {
  return a + b;
};

multiply = (a: number, b: number) => {
  return a * b;
};

y = (m: number, x: number, b: number) => {
  return multiply(m, x)->add(,b);
};
```

### Backwarding Operator

This can also be reversed with the backwarding operator (`<-`):
```
z = if(x < y, 1)
  <- if(x == y, 0)
  <- if(y < 10, 4, 10)
```

## Multiple Return

Functions can also return multiple values:

```
getTwo = {
  @1, 2;
};
```

This results in some nice patterns when combined with argument forwarding:
```si
fetch = (url: string) => {
  // Perform fetch operation...
  @result, error;
};

handleError = (result: any, error?: string) => {
  return if(error, () => {
    log(error);
    @undefined;
  }, result);
};

handleResult = (result?: any) => {
  @log(result);
};

fetch("...")
  ->handleError
  ->handleResult;
```





