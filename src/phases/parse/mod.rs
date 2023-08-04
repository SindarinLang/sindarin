use std::fmt::{self, Debug, Formatter};
use super::tokenize::Token;

pub enum ASTNode {
  Root(Vec<ASTNode>)
}

impl Debug for ASTNode {
  fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
    match self {
      ASTNode::Root(nodes) => {
        write!(f, "Root(")?;
        for node in nodes {
          write!(f, "{:?}", node)?;
        }
        write!(f, ")")
      }
    }
  }
}

pub fn parse(tokens: Vec<Token>) -> ASTNode {
  ASTNode::Root(vec![])
}
