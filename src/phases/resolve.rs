use std::fs;
use std::path::Path;

pub fn resolve(entrypoint: &str) -> std::io::Result<std::path::PathBuf> {
  let path = Path::new(entrypoint);
  fs::canonicalize(path)
}
