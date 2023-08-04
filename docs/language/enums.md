# Enums

```
Message = {
  Quit,
  Move { x: I32, y: I32 },
  Write(String),
  ChangeColor(I32, I32, I32)
};


myMessage = Message.Quit;
```

## Pattern Matching

Enums can then be used in a match block:
```
// Since we don't have an arrow here, we are matching against `x` unlike a normal function:
match = (message: Message) {
  Message.Quit => "Quit",
  Message.Move { x, y } => "Move",
  Message.Write(text) => "Write",
  Message.ChangeColor(r, g, b) => { // We can also open a full function block
    "ChangeColor"
  },
  _ => "Unknown" // If there were more variants, this would be required
};

string = match(myMessage);
```

Alternatively, we can match directly without creating a function:
```
string = myMessage {
  Message.Quit => "Quit",
  Message.Move { x, y } => "Move",
  Message.Write(text) => "Write",
  Message.ChangeColor(r, g, b) => { // We can also open a full function block
    "ChangeColor"
  },
  _ => "Unknown" // If there were more variants, this would be required
};
```

We can also patten match against multiple values using either syntax:
```
match = (message: Message, code: Int32) {
  Message.Quit, 0 => "Quit",
  _, _ => {
    "Other"
  }
};
string = match(myMessage, 0);
```

```
code = 0i32;
string = myMessage, code {
  Message.Quit, 0 => "Quit",
  _, _ => {
    "Other"
  }
};
```
