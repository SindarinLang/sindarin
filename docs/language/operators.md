# Operators

## Precedence

All operators have left to right precedence. Parentheses are required to make the order explicit:
```
a = 1 + 2 * 3;    // 9
a = 1 + (2 * 3);  // 7
```

## Accessors

### Array Indexing

Arrays can be indexed with the `[]` operator:
```
myArray: Int32[3] = [1, 2, 3];
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
myBool == true;
myInt == 1;
myFloat == 1.2;
```

### Not Equal
```
myBool != false;
myInt != 1;
myFloat != 1.2;
```

### Greater Than
```
myInt > 1;
myFloat > 1.2;
```

### Greater Than or Equal
```
myInt >= 1;
myFloat >= 1.2;
```

### Less Than
```
myInt < 1;
myFloat < 1.2;
```

### Less Than or Equal
```
myInt <= 1;
myFloat <= 1.2;
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
myBool = 1 || 0; // true
myInt = 5 || 2; // 7
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
If `b` is falsey, `a` will be undefined, else `a` will be set to `c`:
```
a = b ? c;
```

### Default Operator
If `b` is undefined, `a` will be set to `c`, else `a` will be set to `b`:
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
myInt += 1; // 11
myFloat = 5.5 + 5.5; // 11.0
```

Wrapping addition:
```
myInt = 5 +% 5;
myInt +%= 1;
```

Saturation addition:
```
myInt = 5 +| 5;
myInt +|= 1;
```

Array Addition:
- If LHS is an item in the array, the operator is applied to each element.
- If LHS is the same size array, the operator is applied to each array's matching elements.
```
myArray = [1, 2, 3] + 1; // [4, 5, 6]
myArray = [1, 2, 3] + [4, 5, 6]; // [5, 7, 9]
```

### Subtraction

```
myInt = 5 - 5; // 0
myInt -= 1; // -1
myFloat = 5.5 - 5.5; // 0.0
```

Wrapping subtraction:
```
myInt = 5 -% 5;
myInt -%= 1;
```

Saturation subtraction:
```
myInt = 5 -| 5;
myInt -|= 1;
```

#### Unary Minus
```
myInt = 5;
x = -myInt; // -5
```

### Multiplication

```
myInt = 5 * 5; // 25
myInt *= 1; // 25
myFloat = 5.5 * 5.5; // 30.25
```

Wrapping multiplication:
```
myInt = 5 *% 5;
myInt *%= 1;
```

Saturation multiplication:
```
myInt = 5 *| 5;
myInt *|= 1;
```

Array multiplication:
- If RHS is an item in the LHS, the operator is applied to each element.
- If RHS is the same size array as LHS, the operator is applied to each array's matching 
- If RHS is the inverse size array as LHS, we multiply them as matrices.
```
myArray = [1, 2, 3] * 2; // [2, 4, 6]
myArray = [1, 2, 3] * [4, 5, 6]; // [4, 10, 18]
myArray = [[1, 2, 3], [4, 5, 6]] * [[1, 2], [3, 4], [5, 6]];
```

### Division

```
myInt = 5 / 5; // 1
myInt /= 1; // 1
myFloat = 5.5 / 5.5; // 1.0
```

### Remainder

```
myInt = 5 % 5; // 0
myInt %= 1; // 0
myFloat = 5.5 % 5.5; // 0.0
```

### Exponentiation

```
myInt = 5 ^ 2; // 25
myFloat = 5.0 ^ 2.0; // 25.0
```

## Array Operators

Under the hood, arrays may be converted to other types. For example, a slice might be a pointer and a length. Or, if an array is soley used to iterate through in a for loop, it may be converted to an iterator.

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
myArray = [0..5]; // [0, 1, 2, 3, 4]
```

Ranges can also be inclusive:
```
myArray = [0..=5]; // [0, 1, 2, 3, 4, 5]
```

Ranges can be reversed:
```
myArray = [5..0]; // [5, 4, 3, 2, 1]
```

#### Slices

The Range operator can also be used to create a slice of an array:

```
myArray = [0, 1, 2, 3, 4, 5];
mySlice = myArray[1..3]; // [1, 2]
myInclusiveSlice = myArray[1..=3]; // [1, 2, 3]
myLeftSlice = myArray[..3]; // [0, 1, 2]
myRightSlice = myArray[3..]; // [3, 4, 5]
```
