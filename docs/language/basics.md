# _Basics_

Sindarin has no keywords.

## _Variables_

Variable names must be camelCased. Additionally, all expressions must end with a semicolon.

```
myVariable;
```

## _Types_

Types names must be PascalCased.
```
Boolean;
```

Types can also be declared with an abbreviation:
```
Int32::i32;
```

Types can wrap a value:
```
Boolean(0);
```

Types can also be added to a value by their abbreviation:
```
5i32;
```

Finally, variables can be declared with a type annotation:
```
myVariable: Int32;
```

## _Assignment_

Variables can be assigned a value with the `=` operator. However, the type of either the variable or the value must be declared:

```
myVariable: Int32 = 5;
myVariable = 5i32;
myVariable = Int32(5);
```

## _Values_

### _Boolean_

Booleans are either `1` or `0`.
```
false = Boolean(0);
true = Boolean(1);
```

### _Integer_

Integers do not have decimal points.
```
myInt = Int8(5);
myInt = 5i8;
myInt = 0xFFi8;
myInt = 0o77i8;
myInt = 0b1111_1111i8;
```

Integers can also be declared with single quotes:
```
myChar = Int8('A'); // 65
```

### _Float_

Floats must be declared with a decimal point.
```
myFloat = Float64(4.3);
```

### _Arrays_

Arrays types are declared with brackets to indicate the length, and values are separated by commas. However, the array length can beinferred from the number of elements in the array, and the type from the type of the elements in the array:
```
myArray: Int32[3] = [1, 2, 3];
myArray = Int32[3]([1, 2, 3]);
myArray = Int32[]([1, 2, 3]);
myArray = [1i32, 2i32, 3i32];
```

Arrays can also be declared with a given length, without less values than the length:
```
myArray: Int32[3] = [];
```

Ararys can be filled with a given value by using the `...` operator:
```
myArray: Int32[3] = [...5]; // [5, 5, 5]
myArray: Int32[3] = [1, ...5]; // [1, 5, 5]
myArray: Int32[3] = [...5, 1]; // [5, 5, 1]
```

### _Structs_

Struct types are declared with curly braces, and values are separated by semicolons:
```
MyStruct = {
  myInt: Int32,
  myFloat: Float64
};
```

Instances of a struct can be declared by providing a type annotation, or wrapping the struct:
```
myStruct: MyStruct = {
  myInt = 5,
  myFloat = 5.5
};

myStruct = MyStruct {
  myInt = 5,
  myFloat = 5.5
};
```

### _Strings_
Strings are just arrays of characters:
```
string = "Hello, World!"; // UInt8[13];
```

By default, curly braces must be escaped:
```
string = "Hello, \{World\}!"; // UInt8[15];
```

Otherwise, curly braces can be used to evaluate an expression:
```
name = "World"; // UInt8[5];
string = "Hello, {name}!"; // UInt8[13];
```

#### _Multi-line Strings_
Multi-line strings can be declared in several ways:
```
string = "This is a string
  That wraps to the
  next lines.";

string = """
         Hello,
         World!
         """;
string =
  """
  This is
  another way
  to do it.
  """;
```

### _HTML_
HTML can also be declared with templating, and is converted to a string:
```
string = "World";
html = <div>
         <h1>Hello, {string}!</h1>
       </div>;
html =
  <div>
    <h1>Hello, {string}!</h1>
  </div>;
```

## _Comments_

### _Single Line_

```
// Single line comment
```

### _Multi Line_

```
/**
 * Multi
 * Line
 * Comment
 */
```

Additionally, markdown is supported in multi-line comments:
```
/**
 * # Header
 * 
 * - List
 * - Item
 * 
 * ```s
 * x = 5;
 * ```
 */
```

## _Separators_

Semi-colons are also required after each statement:
```
MyType = {
  myInt: Int32,
  myFloat: Float64
};

x = 5;
```

