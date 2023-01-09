# Operators

All operators have left to right precedence. Parentheses are required to make the order explicit:
```
a = 1 + 2 * 3;    // 9
a = 1 + (2 * 3);  // 7
```

- [Assignment](#assignment)
- [Primitives](#primitives)
  - [Type Annotations](#type-annotations)
- [Arrays](#arrays)
  - [Type Annotations](#type-annotations-1)
  - [Filling Arrays](#filling-arrays)
  - [Strings](#strings)
- [Structs](#structs)
  - [Types](#types)
  - [Instances](#instances)
- [Accessors](#accessors)
  - [Array Indexing](#array-indexing)
  - [Struct Properties](#struct-properties)
- [Comparison Operators](#comparison-operators)
  - [Equal](#equal)
  - [Not Equal](#not-equal)
  - [Greater Than](#greater-than)
  - [Greater Than or Equal](#greater-than-or-equal)
  - [Less Than](#less-than)
  - [Less Than or Equal](#less-than-or-equal)
- [Bitwise Operators](#bitwise-operators)
  - [Not](#not)
  - [And](#and)
  - [Or](#or)
  - [Xor](#xor)
  - [Left Shift](#left-shift)
  - [Right Shift](#right-shift)
- [Logical Operators](#logical-operators)
  - [Conditional Operator](#conditional-operator)
  - [Default Operator](#default-operator)
  - [Ternary Operator](#ternary-operator)
- [Arithmetic Operators](#arithmetic-operators)
  - [Addition](#addition)
  - [Subtraction](#subtraction)
    - [Unary Minus](#unary-minus)
  - [Multiplication](#multiplication)
  - [Division](#division)
  - [Remainder](#remainder)
  - [Exponentiation](#exponentiation)
- [Array Operators](#array-operators)
  - [Destructure](#destructure)
  - [Range](#range)
  - [Size](#size)


## Assignment

Variables can be assigned without a keyword such as `let`, `const`, or `var`. Variables should also be camelCased.

### Primitives

```
sindarin {
  true
};

myBool = true;  // Bool
myInt = 5;      // Int32
myFloat = 5.5;  // Float64
myChar = 'a';   // UInt8
```

If no types are assigned, integer values will default to `Int32` and floating point values will default to `Float64`.

> Note: `true` must be imported from the standard library.

#### Type Annotations

I can also use the `:` operator to set the type of a variable:

```
sindarin {
  Bool,
  UInt32,
  Float32
};

myBool: Bool = 1;
myInt: UInt32 = 5;
myFloat: Float32 = 5.5;
```

### Arrays

Arrays are initialized with brackets:
```
myArray = [1, 2, 3]; // Int32[3]
```
By default the length is inferred from the number of elements in the array, and the type from the type of the elements in the array.

#### Type Annotations

Arrays can also be initialized with a given length, using a type annotation:
```
myArray: Int32[3] = [];
```

#### Filling Arrays

Arrays can be filled with a value by using the the destructuring operator on a primitive type:
```
myArray: Int32[3] = [...5]; // [5, 5, 5]
```

#### Strings

Strings are initialized with double quotes, and are syntactic sugar for arrays of characters:
```
myString = "Hello, World!"; // UInt8[13]
```

### Structs

#### Types

Struct types are declared with `:`, and should be PascalCased:
```
MyStruct = {
  myProp: UInt32;
};
```

### Instances

The type `MyStruct` can now be used to create instances of the struct.

Struct properties are assigned with `=`:
```
myStruct: MyStruct = {
  myProp = 5;
};
```

If no type is assigned, the type will be inferred from the struct definition:
```
myStruct = {
  myProp = 5;
};
```

## Accessors

### Array Indexing

Arrays can be indexed with the `[]` operator:
```
myArray = [1, 2, 3];
myArray[0]; // 1
```

### Struct Properties

Struct properties can be accessed with the `.` operator:
```
myStruct = {
  myProp = 5;
};
myStruct.myProp; // 5
```

## Comparison Operators

### Equal

```
true == true; // true
5 == 5; // true
5.5 == 5.5; // true
```

### Not Equal

```
true != true; // false
5 != 5; // false
5.5 != 5.5; // false
```

### Greater Than

```
5 > 5; // false
5.5 > 5.5; // false
```

### Greater Than or Equal

```
5 >= 5; // true
5.5 >= 5.5; // true
```

### Less Than

```
5 < 5; // false
5.5 < 5.5; // false
```

### Less Than or Equal

```
5 <= 5; // true
5.5 <= 5.5; // true
```

## Bitwise Operators

### Not

```
notBool = !true; // false
notInt = !5; // -6
```

### And

```
myBool = 1 & 1; // true
myInt = 5 & 1; // 1
```

### Or

```
myBool = 1 | 0; // true
myInt = 5 | 2; // 7
```

### Xor

```
myBool = 1 &| 0; // true
myInt = 5 &| 3; // 6
```

### Left Shift

```
myInt = 5 << 1; // 10
```

### Right Shift

```
myInt = 5 >> 1; // 2
```

## Logical Operators

### Conditional Operator

If `b` is falsy, `a` will be `undefined`, else `a` will be set to `c`:
```
a = b ? c;
```

### Default Operator
If `b` is `undefined`, `a` will be set to `c`, else `a` will be set to `b`:
```
a = b ! c;
```

### Ternary Operator

The conditional operator and the default operator can be combined to imitate a ternary operator. If `b` is truthy, set `a` to c, else set `a` to `d`.
```
a = b ? c ! d;
```

## Arithmetic Operators

### Addition

```
myInt = 5 + 5; // 10
myFloat = 5.5 + 5.5; // 11.0
```

### Subtraction

```
myInt = 5 - 5; // 0
myFloat = 5.5 - 5.5; // 0.0
```

#### Unary Minus
```
myInt = 5;
x = -myInt; // -5
```

### Multiplication

```
myInt = 5 * 5; // 25
myFloat = 5.5 * 5.5; // 30.25
```

### Division

```
myInt = 5 / 5; // 1
myFloat = 5.5 / 5.5; // 1.0
```

### Remainder

```
myInt = 5 % 5; // 0
myFloat = 5.5 % 5.5; // 0.0
```

### Exponentiation

```
myInt = 5 ^ 2; // 25
myFloat = 5.0 ^ 2.0; // 25.0
```

## Array Operators

### Destructure

#### Destructuring Arrays

```
myArray = [1, 2, 3];
myNewArray = [...myArray]; // [1, 2, 3]
```

#### Destructuring Primitives

```
myArray: Boolean[5] = [...true];
myArray: Int32[5] = [...5];
myArray: Float64[5] = [...5.5];
```

### Range

#### Integers

The Range operator can be used with integers to fill an array:

```
myArray = [0..5]; // [0, 1, 2, 3, 4, 5]
```

#### Slices

The Range operator can also be used to create a slice of an array:

```
myArray = [0, 1, 2, 3, 4, 5];
mySlice = myArray[1..3]; // [1, 2, 3]
myLeftSlice = myArray[..3]; // [0, 1, 2, 3]
myRightSlice = myArray[3..]; // [3, 4, 5]
```

### Size

The Size operator can be used to get the length of an array:

```
myArray = [0, 1, 2, 3, 4, 5];
myArraySize = #myArray; // 6
```
