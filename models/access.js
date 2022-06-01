const mongoose = require('mongoose');
// const Schema = mongoose.Schema();
const Schema = mongoose.Schema;

const accessSchema = new Schema({
  host: {
    // the target project to link to
    type: Schema.Types.Mixed,
    id: {
      // what intity is doing the linking
      type: Schema.Types.ObjectId,
    },
    owner_id: {
      type: Schema.Types.ObjectId,
    },
  },
  link: {
    // the person or project that wants link access
    id: {
      type: Schema.Types.ObjectId,
    },
    owner_id: {
      type: Schema.Types.ObjectId,
    },
  },
  invite: {
    // this document is created by the host to the link
    type: Schema.Types.Mixed,
    active:{
      type: Boolean,
      default: false,
    },
    access: {
      // what level of access is being invited?
      type: String,
      default: "",
    }
  },
  request: {
    // this document is created by the host to the link
    type: Schema.Types.Mixed,
    active: {
      type: Boolean,
      default: false,
    },
    access: {
      // what level of access is being requested?
      type: String,
      default: "",
    }
  },
  watch: {
    type: Boolean,
    default: true,
  },
  block: {
    type: Boolean,
    default: false,
  },
  support: {
    type: Boolean,
    default: false,
  },
  subscribe: {
    type: Boolean,
    default: false,
  },
  join: {
    type: Boolean,
    default: false,
  },
});

const Access = mongoose.model("action", accessSchema);

module.exports = Access;
