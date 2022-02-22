
export const detect_project_type = ({_id, owner_id, parent_project}) => {
  return (owner_id != parent_project) ? "project" : _id != owner_id ? "organization" : "user";
}
