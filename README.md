<div id="sindarin" align="center">
  <h1 align="center">
    <div>🕊</div><i>Sindarin ~</i>
  </h1>
  <h6><i>"One Language to Rule Them All"</i></h6>
  <br />
</div>

Sindarin is an attempt to design a "universal transpiler". Primitives are imported so multiple transpilation targets can be used as "backends" for the language.

> _"Write once, run any how."_

<h2 id="contents"><div align="right"><a href="#sindarin">🔝</a></div><i>Contents</i></h2>

- [Philosophy](#philosophy)
  - [Syntax](#syntax)
  - [Features](#features)
- [Docs](#docs)

<h2 id="philosophy"><div align="right"><a href="#sindarin">🔝</a></div><i>Philosophy</i></h2>

### _Syntax_

#### _Keywords_

Sindarin has no keywords - only operators and punctuation.

#### _Separators_

Separators are good. They create "visual abstraction", and make code easier to read. Sindarin requires semicolons at the end of assignments, and uses curly braces for blocks.

#### _Operators_

Operators should visually imply their function as much as possible.

#### _Autocomplete_

A language should be grammatically ordered such that autocomplete is possible. For example, the import / from ordering in JavaScript prevents useful autocomplete:

```js
import { foo } from "bar;
```

Instead, imports in Sindarin are reversed:
```
bar { foo };
```

### _Features_

#### _"Function Oriented"_

Sindarin is designed to make function oriented programming easy. [Partial Application](docs/functions.md#partial-application) for example, makes currying much easier.

#### _Type Safe_

Sindarin is designed to be type safe, even when the underlying transpilation target is not.

### _Docs_

#### _Language_

- [Basics](docs/basics.md)
  - [Variables](docs/basics.md#variables)
  - [Types](docs/basics.md#types)
  - [Assignment](docs/basics.md#assignment)
  - [Values](docs/basics.md#values)
  - [Comments](docs/basics.md#comments)
  - [Separators](docs/basics.md#separators)
- [Operators](docs/operators.md)
  - [Precedence](docs/operators.md#precedence)
  - [Accessors](docs/operators.md#accessors)
  - [Comparison Operators](docs/operators.md#comparison_operators)
  - [Bitwise Operators](docs/operators.md#bitwise-operators)
  - [Logical Operators](docs/operators.md#logical-operators)
  - [Arithmetic Operators](docs/operators.md#arithmetic-operators)
  - [Array Operators](docs/operators.md#array-operators)
- [Functions](docs/functions.md)
  - [Basics](docs/functions.md#basics)
  - [Generics](docs/functions.md#generics)
  - [First Class Functions](docs/functions.md#first-class-functions)
  - [Argument Forwarding](docs/functions.md#argument-forwarding)
  - [Partial Application](docs/functions.md#partial-application)
  - [Multiple Return Values](docs/functions.md#multiple-return-values)
  - [Solving the Colored Function Problem](docs/functions.md#solving-the-colored-function-problem)
- [Units](docs/units.md)
  - [Type Abbreviations](docs/units.md#type-abbreviations)
  - [Conversions](docs/units.md#conversions)
  - [Higher Order Units](docs/units.md#higher-order-units)
  - [Operator Overloading](docs/units.md#operator-overloading)
- [Traits](docs/traits.md)
- [Enums](docs/enums.md)
  - [Pattern Matching](docs/enums.md#pattern-matching)
- [Imports](docs/imports.md)
  - [Sindarin](docs/imports.md#sindarin)
  - [Plugins](docs/imports.md#plugins)
- [Standard Library](docs/standard-library.md)
  - [Types](docs/standard-library.md#types)
  - [Functions](docs/standard-library.md#functions)

## LLVM Branch

The previous version of Sindarin was simply focused on syntax, rather than on transpilation. The [llvm branch](https://github.com/SindarinLang/sindarin/tree/llvm) includes a proof-of-concept LLVM compiler written in TypeScript.

