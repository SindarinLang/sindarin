# Units

## Type Abbreviations

Types can be defined as an expression of other types.
```
Meter::m = Float64;
Second::s = Float64;
Speed = Meter / Second;

distance = 5.0m;
time = 2.0s;

speed = distance / time; // 2.5 m/s
```

## Conversions

Additionally, abbreviations can be used with operators to define units:
```
speed = 3.5m/s;
```

## Higher Order Units

Higher order units are automatically supported, and can be written with `^` or with `*`:
```
area = 5.0m * 5.0m; // 25.0 m^2
area = 25.0m^2; // 25.0 m^2
area = 25.0m*m;
```

If two types with conflicting units are in scope, the type will need to be specified:
```
Speed = Meter / Second;
Velocity::v = Meter / Second;

speed = 5.0m / 2.0s; // Error: Ambiguous type
speed: Speed = 5.0m / 2.0s;
speed = Speed(5.0m / 2.0s);
```

## Operator Overloading

Operators can be overloaded for types:
```
Vec2d = {
  x: Float64,
  y: Float64,
  + = (a: $, b: Vec2d) => {
    Vec2d {
      x: a.x + b.x,
      y: a.y + b.y
    }
  }
};

a = Vec2d({ x: 0.0, y: 0.0 });
b = Vec2d({ x: 1.0, y: 1.0 });

c = a + b; // Vec2d({ x: 1.0, y: 1.0 })
```

Operators can also be overloaded without defining a type:
```
// Applies in scope only:
+ = (a: Vec2d, b: Vec2d) => {
  Vec2d {
    x: a.x + b.x,
    y: a.y + b.y
  }
};
```
