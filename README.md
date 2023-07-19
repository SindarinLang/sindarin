<div id="sindarin" align="center">
  <h1 align="center">
    <div>🕊</div><i>Sindarin ~</i>
  </h1>
  <h6><a href="https://www.youtube.com/watch?v=vQA5aLctA0I"><i>"An elegant language, for a more civilized age."</i></a></h6>
  <br />
</div>

<h2 id="installation"><div align="right"><a href="#sindarin">🔝</a></div><i>Installation</i></h2>

> Coming Soon&trade;

<h2 id="contents"><div align="right"><a href="#sindarin">🔝</a></div><i>Contents</i></h2>

- [Philosophy](#philosophy)
  - [Syntax](#syntax)
  - [Features](#features)
- [Docs](#docs)
- [FAQ](#faq)
- [Development Setup](#development-setup)

<h2 id="philosophy"><div align="right"><a href="#sindarin">🔝</a></div><i>Philosophy</i></h2>

### _Syntax_

#### _Keywords_

Naming things is good, as it makes code more readable. However, keywords are bad as they prevent you from naming things using certain words.

Sindarin has no keywords - only operators so that you can name your variables whatever you want.

Instead you can import many of the things that would normally be keywords from the standard library. If one of the imports collides with something you've already named, you can simply rename the import.

This also makes Sindarin usable without the standard library. You can bring your own standard library if you want.

#### _Separators_

Separators are good. They create "visual abstraction", and make code easier to read. Sindarin requires semicolons at the end of assignments, and uses curly braces for blocks.

#### _Operators_

Operators should visually imply their function as much as possible.

#### _Autocomplete_

A language should be ordered such that autocomplete is possible. For example, the import / from ordering in JavaScript prevents useful autocomplete:

```js
import { foo } from "bar;
```

Instead, imports in Sindarin are reversed:
```
bar { foo };
```

### _Features_

#### _"Function Oriented"_

Sindarin is designed to make function oriented programming easy. [Partial Application](docs/functions.md#partial-application) for example, makes currying easy.

#### _Compiled_

Sindarin is compiled using LLVM.

#### _Type Safe_

Sindarin is statically typed.

#### _Memory Safe?_
#### _Copy on Write?_
#### _Exceptionless_

Don't throw exceptions.

<h2 id="docs"><div align="right"><a href="#sindarin">🔝</a></div><i>Docs</i></h2>

- [Syntax](docs/syntax.md)
- [Operators](docs/operators.md)
- [Functions](docs/functions.md)
- [Modules](docs/modules.md)
- [Standard Library](docs/standard-library.md)
- [Types](docs/types.md)

<h2 id="faq"><div align="right"><a href="#sindarin">🔝</a></div><i>FAQ</i></h2>

### _What is the goal of Sindarin?_

This is a project exploring what a programming language with the ideal syntax might look like.

### _Why TypeScript?_

TypeScript is fast to develop in, which is great for proof of concept/design space exploration. If this gets to a point where it's actually usable, I'd rewrite it in Rust.


<h2 id="development-setup"><div align="right"><a href="#sindarin">🔝</a></div><i>Development Setup</i></h2>

### _Install on macOS:_
```
brew install cmake llvm
```

### _Install on Ubuntu:_
```
sudo apt-get install cmake llvm
```
