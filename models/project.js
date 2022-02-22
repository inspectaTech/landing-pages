const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  owner_id: {
    type: Schema.Types.ObjectId,
    required: true,
    validate: {
      validator: (value) => {
        // make sure ObjectId is valid
        return true;
      }
    }
  },
  parent_project: {
    type: Schema.Types.ObjectId,
    required: true,
    validate: {
      validator: (value) => {
        // make sure ObjectId is valid
        return true;
      }
    }
  },
  name:{
    // group name - original name can be the owner ObjectId
    // unique: true,// doesn't have to be unique - or must match the path?
    required:true,
    trim: true,
    type: String,
    // i think the name can be replicated - the alias will be modified or must be custom - the alias creates the url
  },
  alias:{
    // this is a unique value - similar to name above without spaces and possibly with a numeric modifier
    // sample: "5e16b0ae8ee064177cd3f53b/project-###"
    // "user"
    unique: true,
    required:true,
    trim: true,
    type: String,
    validate: {
      validator: (value) => {
        // check to see if value toLowerCase matches any other value toLowerCase
        // checkt to see if the sanitized version of the name matches any alias - alias will add dashes etc as necessary
        // see getData/alias_maker
        return true;
      }
    }
  },
  path:{
    // similar to name except lowercased, dashed, possibly with numeric modifier
    // sample: "project-###"
    // "user"
    required:true,
    trim: true,
    type: String
  },
  access: {
    // who can modify this project
    type: Schema.Types.Mixed,
    data: {
      type: Schema.Types.Mixed,
    },
  },
})

const Project = mongoose.model("project", projectSchema);

module.exports = Project;

// ObjectId("5e30875a6c5ecf23d59db088") - pref _id
