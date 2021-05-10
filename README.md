<h1 id="sindarin"><div align="right">🕊</div><i>Sindarin ~</i></h1>

> _["An elegant language, for a more civilized age."](https://www.youtube.com/watch?v=vQA5aLctA0I)_

<h2 id="contents"><div align="right"><a href="#sindarin">🔝</a></div><i>Contents</i></h2>

- [The High Level](#the-high-level)
- ["Blow my mind in 30 seconds"](#blow-my-mind-in-30-seconds)  
  - [Function Baking (currying, but better)](#function-baking-currying-but-better)
  - [Argument Forwarding](#argument-forwarding)
  - [Multi-Return](#multi-return)
  - [Naked Functions](#naked-functions)
- [Syntax](#syntax)
  - [Comments](#comments)
  - [Semi-colons](#semi-colons)
  - [Modules](#modules)
    - [Imports](#imports)
    - [Exports](#exports)
  - [Variables](#variables)
  - [Types](#types)
- [Standard Funtions](#standard-functions)
- [Operators](#operators)
- [Input / Output](#input-output)
- [Development Setup](#development-setup)  

<h2 id="the-high-level"><div align="right"><a href="#sindarin">🔝</a></div><i>The High Level</i></h2>

- Functional
- Compiled
- Type-safe
- Garbage-collected
- Multi-threaded
- Copy-on-write

<h2 id="blow-my-mind-in-30-seconds"><div align="right"><a href="#sindarin">🔝</a></div><i>"Blow my mind in 30 seconds"</i></h2>

### _Function Baking (currying, but better)_
Commas leave some arguments unspecified, while baking others into a new function:
```
add = (a: number, b: number) => {
  return a + b;
};

increment = add(1,);  // (b: number) => number;

x = increment(2);     // 3
```

### _Argument Forwarding_
With the forward operator (`->`), functions snap together like Legos:
```
add = (a: number, b: number) => {
  return a + b;
};

multiply = (a: number, b: number) => {
  return a * b;
};

y = (m: number, x: number, b: number) => {
  return multiply(m, x)->add(,b);  
  // Less-civilized equivalent: return add(multiply(m, x), b);
};
```
This can also be reversed with the backward operator (`<-`):
```
// if(condition: boolean, then: any, else: any);

z = if(x < y, 1)
  <- if(x == y, 0)
  <- if(y < 10, 4, 10)

// Less-civilized equivalent: z = if(x < y, 1, if(x == y, 0, if(y < 10, 4, 10)))

```

### _Multi-Return_
Functions can also return multiple values:
```si
fetch = (url: string) => {
  // Perform fetch operation...
  return result, error;
};

result, error = fetch("https://example.com/path");
```

This results in some nice patterns when combined with argument forwarding:
```
handleError = (result: any, error?: string) => {
  return if(error, () => {
    log(error);
    return undefined;
  }, result);
};

handleResult = (result?: any) => {
  return log(result);
};

fetch("...")
  ->handleError
  ->handleResult;
```

### _Naked Functions_
Functions without argments don't require `() =>`, and are immediately called:
```
myNum = {
  log("nice");
  return 5;
};

// myNum = 5
```
In an if statement:
```
a = if(1 < 2, {
  log("thing");
  return 5;
}, {
  return 6;
});

// a = 5
```

<h2 id="syntax"><div align="right"><a href="#sindarin">🔝</a></div><i>Syntax</i></h2>

### _Comments_
```
// Single line comment

/**
* Multi
* Line
* Comment
*/
```
### _Semi-colons_
Semi-colons are required at the end of statements:
```
x = 5;

fn = () => {
  return 6;
};
```

### _Modules_

#### _Example sindarin.json:_
```json
{
  "name": "my-package-name",
  "version": "1.0.0",
  "main": "source/index.si",
  "dependencies": {
    "other-library": "https://github.com/my-user/repo-name",
    "relative-alias": "./source/example-dir"
  }
}
```

#### _Imports_

Standard functions are imported:
```
import { if, for };
```

All standard functions can also be imported with `*`:
```
import *;
```

External and relative libraries can be imported with `from`:
```
from "./relative/path" import *;
from "other-library" import { thing };
```
Or import directly:
```
from "https://github.com/example/repo" import { otherThing };
```
Imports can also be deeply nested:
```
import { console.log };
from "other-library" import { thing.run };

log();
run();
```

#### _Exports_
All values and functions can be exported:
```
export x = 5;

export add = (a: number, b: number) => {
  return a + b;
};

export struct = {
  a: 1,
  b: {
    nested: 5
  }
};
```
In another module:
```
from "module-1" import { x, add, struct.b };

// b.nested = 5
```

### _Variables_
Variables can be initialized without a keyword, but must start lowercase:
```
x = true;
y = 5;
z = "ok";
```
Arrays are initialized with brackets:
```
x = [
  1,
  "a",
  () => 5
];
```
Struct properties are initialized with `:` or `=`:
```
x = {
  a: 1,
  b = "ok"
};

// x.a = 1
// x["b"] = "ok"
```
Sets are initialized as structs without keys:
```
x = {
  "a",
  1,
  () => 5
};

// x.a = "a";
// x[1] = 1;
```
Enums are initialized as structs without values:
```
x = {
  TALL,
  SHORT
};

// x.TALL = "TALL"
// x["SHORT"] = "SHORT"
```

### _Types_
Types are capitalized and initialized with `=`, but applied with `:`:
```
import { String, Number };

Person = {
  first: String,
  last: String,
  age: Number
};

a: Person = {
  first = "Ben",
  last = "Kenobi",
  age = 57
};
```

<h2 id="standard-functions"><div align="right"><a href="#sindarin">🔝</a></div><i>Standard Functions</i></h2>

### _if_
```
import { if };

if(1<2, 5, 7); // 5
```

### _for_
```
import { for };

for([1, 2, 3], (item: number, index: number, array: number[]) => {
  // ...
});
```

### _type_
```
import { type, types };

type(true);       // types.BOOLEAN
type(1);          // types.NUMBER
type("string");   // types.STRING
type([1, 2]);     // types.ARRAY
type({ a: 1 });   // types.STRUCT
type(() => 5);    // types.FUNCTION
type(undefined);  // types.UNDEFINED

```

### _boolean_
```
import { boolean };

boolean(true);      // true
boolean(1);         // true
boolean(0);         // false
boolean("");        // false
boolean("string");  // true
boolean([1, 2]);    // true
boolean([]);        // false
boolean({ a: 1 });  // true
boolean({});        // false
boolean(() => 5);   // true
boolean(undefined); // false
```

### _number_
```
import { number };

number(true);       // 1
number(1);          // 1
number("1");        // 49
number([1, 2]);     // undefined
number({ a: 1 });   // undefined
number(() => 1);    // undefined
number(undefined);  // undefined
```

### _string_
```
import { string };

string(true);       // "true"
string(1);          // "1"
string([1, 2]);     // "[1,2]"
string({ a: 1 });   // '{"a":1}'
string(() => 1);    // some unique identifier for the function
string(undefined);  // "undefined"
string(1, 2);       // "1,2"
```

### _array_
```
import { array };

array(true);                    // [true]
array(1);                       // [1]
array([1, 2]);                  // [1, 2]
array({ 0: 1, 1: "b", a: 3 });  // [1, "b", ["a", 3]]
array(() => 5);                 // [() => 5]
array(undefined);               // []
array(1, 2);                    // [1, 2]
```

### _struct_
```
import { struct };

struct(true);               // { 0: true }
struct(1);                  // { 0: 1 }
struct([1, "b", ["a", 3]]); // { 0: 1, 1: "b", a: 3 }
struct({ a: 1 });           // { a: 1 }
struct(() => 5);            // { 0: () => 5 }
struct(undefined);          // {}
struct(1, 2);               // { 0: 1, 1: 2 }
```

### _function_
```
import { function };

function(true);       // () => true;
function(1);          // () => 1;
function("string");   // () => string;
function([1, 2]);     // () => [1, 2];
function({ a: 1 });   // () => { a: 1 };
function(() => 5);    // () => () => 5;
function(undefined);  // () => undefined;
```

### _destruct_
```
import { destruct };

destruct(true);           // true
destruct(1);              // 1
destruct("string");       // "string"
destruct([1, 2]);         // 1, 2
destruct({ 0: 1, a: 2 }); // 1, ["a", 2]
destruct(() => 5);        // () => 5
destruct(undefined);      // undefined
destruct([1, 2], [3, 4]); // 1, 2, 3, 4
```

### _"As String" Functions_

#### _parse_
```
import { parse };

parse("true");    // true
parse("1");       // 1
parse("1.2");     // 1.2
parse("ok");      // undefined
parse('"ok"');    // "ok"
parse("[1]");     // [1]
parse('{"a":1}'); // { a: 1 }
```
#### _length_
```
import { length };

length("ok"); // 2
length("");   // 0

length(true); // 4
length(1);    // 1
length(10);   // 2
```

#### _split_
```
import { split };

split("abc");       // ["a", "b", "c"]
split("abc", "b");  // ["a", "c"]
```

### _"As Array" Functions_

#### _count_
```
import { count };

count([1, "b"]);    // 2

count(true);        // 1
count(1);           // 1
count({ 1, "b" });  // 2 
```

<h2 id="operators"><div align="right"><a href="#sindarin">🔝</a></div><i>Operators</i></h2>

### _Generic Operators_
#### _Addition_
```
x = true + true;      // true
x = true + 1;         // true
x = true + "a";       // true
x = true + [1];       // undefined
x = true + { a: 1 };  // undefined
x = 1 + true;         // 2
x = 1 + 1;            // 2
x = 1 + "a";          // 98
x = 1 + [1];          // undefined
x = 1 + { a: 1 };     // undefined
x = "a" + true;       // "atrue"
x = "a" + 1;          // "a1"
x = "a" + "b";        // "ab"
x = "a" + [1];        // undefined
x = "a" + { a: 1 };   // undefined
x = [1] + true;       // [1, true]
x = [1] + 1;          // [1, 1]
x = [1] + "a";        // [1, "a"]
x = [1] + { a: 1 };   // [1, ["a", 1]]
x = { a: 1 } + true;  // { 0: true, a: 1 }
x = { a: 1 } + 1;     // { 0: 1, a: 1 }
x = { a: 1 } + "b";   // { 0: "b", a: 1 }
x = { a: 1 } + [1];   // { 0: 1, a: 1 }
```

#### _Type-Agnostic Equals_
```
true == true      // true
true == 1         // true
true == "a"       // true
true == [1]       // true
true == { a: 1 }  // true
1 == true         // true
1 == 1            // true
1 == "a"          // false
1 == [1]          // false
1 == { a: 1 }     // false
```

#### _Type-Aware Equals_
```
true === true // true
true === 1    // false
true === "a"  // false
```

#### _Less Than_
```
1 < "a"       // true   (compared as numbers)
1 < () => 5   // undefined
"a" < 1       // false  (compared as strings)
```
#### _Greater Than_
#### _Less Than or Equal_
#### _Greater Than or Equal_


#### _And_
```
x = true & true;  // true
x = true & 1;     // true
x = true & "a";   // true
```

#### _Or_
```
x = false | true;  // true
x = false | 1;     // true
x = false | "a";   // true
```

### _"As Number" Operators_
```
x = 4 - 2;    // 2
x = 4 / 2;    // 2
x = 4 / 0;    // infinity
x = 4 * 2;    // 8
x = 4 ^ 2;    // 16
x = 7 % 2;    // 1

x = 1 + true; // 2
x = true + 1; // 2
```

### _Destructor_
```
a = [1, 2, 3];
b = [0, ...a];

// b = [0, 1, 2, 3];
```
The destruct operator can also be returned:
```
fn = (..., error) => {
  log(error);
  return ...;
};

a, b, c = fn(1, 2, 3, "ERROR");
```

### _Default_
If `b` is `undefined`, set `a` to `c`, else set `a` to `b`.
```
a = b ?? c;
```

### _Ternary_
If `b` is truthy, set `a` to c, else set `a` to `d`.
```
a = b ? c : d;
```

<h2 id="input-output"><div align="right"><a href="#sindarin">🔝</a></div><i>Input / Output</i></h2>

```
import { console.log };

log("Hi");
```

<h2 id="development-setup"><div align="right"><a href="#sindarin">🔝</a></div><i>Development Setup</i></h2>

### _Install on macOS:_
```
brew install cmake llvm
```

### _Install on Ubuntu:_
```
sudo apt-get install cmake llvm-11
```
