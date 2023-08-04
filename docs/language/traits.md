# Traits

Types can be declared with methods. Within methods, the `$` operator can be used refer to the type instance:
```
MyType = {
  a: Int32,
  b: Int32,
  myMethod: ($) => $.a + $.b;
};
```

Types can also be declared with unimplemented methods:
```
Printable = {
  print: ($) => ();
};

Nameable = {
  getName: ($) => String;
};
```

Other types can then implement other types:
```
Person: Printable, Nameable = {
  name: String,
  age: Int32,
  print: (self: $) => {
    out($.name);
  },
  getName: (self: $) => $.name
};
```

A type that implements another type can then be passed to a function that expects the implemented type:
```
bob = Person { name: "Bob", age: 42 };

print = (p: Printable) => {
  p.print();
};
```

Similarly, this can be combined with generics:
```
Into = {
  into: <T>($) => T;
};

MyType: Into = {
  into: <T>(self: $) => T {
    // ...
  };
};

myInstance = MyType { /* ... */ };
converted = myInstance.into<OtherType>();
```
