

export const get_toolbar = name => {
  switch (name) {
    case "comment":
    case "basic":
      return "BasicToolbar";
      break;
    case "block":
      return "BlockToolbar";
      break;
    case "code":
      return "CodeToolbar";
      break;
    default:
      return "BasicToolbar";
  }// switch
}// get_toolbar
