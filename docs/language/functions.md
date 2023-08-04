# Functions

## Basics

Function types are declared with `=>`:

```
MyFnType = (Int32, Int32) => Int32;
```

Functions can be called without parameters. Values are returned by simply writing an expression without a semicolon:
```
getFive = {
  5i32
};
```

Functions can also have parameters:
```
addPlusOne = (a: Int32, b: Int32) => {
  c = a + b;
  c + 1i32
};
```

One-line functions can omit the curly braces:
```
add = (a: Int32, b: Int32) => a + b;
```

## Generics

Functions can be generic:
```
MyGenericFnType = <I, O>(I) => O;
```

Functions can also be generic for a given array size:
```
MyGenericFnType = <A[N][M], B[M][N]>(a: A[N][M], b: B[M][N]) => {
  // ...
};
```

## First Class Functions

Functions can also be passed as parameters:
```
callFn = (fn: MyFnType) => {
  fn(5i32, 6i32)
};
```

## Argument Forwarding

Values can be forwarded to functions which take that argument as the first parameter:
```
add = (a: Int32, b: Int32) => a + b;

myNumber = 4i32;

result = myNumber->add(5i32); // 9
```

These can be chained:
```
add = (a: Int32, b: Int32) => a + b;
multiply = (a: Int32, b: Int32) => a * b;

myNumber = 4i32;

result = myNumber
  ->add(5i32)
  ->multiply(2i32); // 18
```

Additionally, functions which return Void can be forwarded to any other function:
```
print: (Int32) => Void;

print()->myOtherFn(5i32);

// Same as:
// print();
// myOtherFn(5i32);
```

## Partial Application

Arguments can also be left unspecified with the `_` symbol, which creates a new function wrapping the value that was passed in:
```
add = (a: Int32, b: Int32) => a + b;

increment = add(1i32, _); // (b: Int32) => Int32;

result = increment(5i32); // 6
```

## Multiple Return Values

Functions can return a tuple of values:
```
fetchUser = (id: Int32) => {
  // ...
  user, error
};

user, error = fetchUser(5i32);
```

## Solving the Colored Function Problem

```
myAsyncFn = (a: Int32) ~> {
  x ~ readFile("...");
  x
};

// Since this function executes async code, it automatically awaits the result
// before returning. You can't get a Future back
mySyncFn = (a: Int32) => {
  x ~ readFile("...");
  x
};

syncResult = mySyncFn(1);
asyncResult ~ myAsyncFn(1);
// Alternative:
// myFuture = myAsyncFn(1);
// asyncResult ~ myFuture;
```

```
// Any time you use . on a Future, it awaits the future so you can access the property.
// However, you still need ~, as this still creates another future:
future = fetch().json();
result ~ fetch().json();
```
