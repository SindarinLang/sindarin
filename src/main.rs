mod phases;

use phases::{resolve, read, tokenize, parse};

fn main() {
  let args: Vec<String> = std::env::args().collect();
  if args.len() > 1 {
    match resolve(&args[1]) {
      Ok(path) => {
        match read(&path) {
          Ok(contents) => {
            let tokens = tokenize(&contents);
            let ast = parse(tokens);
            println!("{:?}", ast);
          },
          Err(e) => println!("Error: {}", e)
        };
      },
      Err(e) => println!("Error: {}", e)
    };
  } else {
    println!("No entrypoint provided");
  }
}




