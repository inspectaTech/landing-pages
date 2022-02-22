const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pairSchema = new Schema({
  host_id:{
    type: Schema.Types.ObjectId
  },
  host_type:{
    type: String,
    trim: true,
    default:""
  },
  link_id:{
    type: Schema.Types.ObjectId
  },
  link_type:{
    type: String,
    trim: true,
    default:""
  },
  owner_id:{
    type: Schema.Types.ObjectId
  },
  editor_id:{
    type: Schema.Types.ObjectId
  },
  pair_order:{
    type: Number,
    default: 0
  },
  pair_priority: {
    type: Number,
    default: 0
  },
  pair_review: {
    type: Number,
    default: 0
  },
  pair_caption: {
    type: String,
    trim: true,
    default: ""
  },
  pair_pin: {
    type: Boolean,
    default: false
  },
  pair_pin_expires: {
    type: Date,
  },
  pair_pin_created: {
    type: Date,
  },
  pair_pin_archive: {
    type: Boolean,
    default: false
  },
  admin: {
    type: Boolean,
    default: false
  },
  attachment: {
    type: Boolean,
    default: false
  },
  created: {
    type: Date,
    default: Date.now,
    validate: {
      validator: (value) => {
        return true;
      }
    }
  },
  modified: {
    type: Date,
    default: Date.now,
    validate: {
      validator: (value) => {
        return true;
      }
    }
  }
},{timestamp: true, createdAt: "created", updatedAt: "modified"});


const Pair = mongoose.model("pair", pairSchema);

module.exports = Pair;
