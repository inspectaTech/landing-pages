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
  host_display: {
    type: String,
    trim: true,
    default: "media"
  },
  host_project_id: {
    type: Schema.Types.ObjectId
  },
  link_id:{
    type: Schema.Types.ObjectId
  },
  link_type:{
    type: String,
    trim: true,
    default:""
  },
  link_display: {
    type: String,
    trim: true,
    default: "media"
  },
  link_project_id: {
    type: Schema.Types.ObjectId
  },
  owner_id:{
    /**is this owner the link owner or the host owner? - i think its the link owner 
     * - the host owner should be the editor since they have to have permission to attach the link to the host */
    type: Schema.Types.ObjectId
  },
  editor_id:{
    /**also the host owner */
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
    type: Schema.Types.Mixed,
    text: {
      type: String,
      trim: true,
      default: "",
    },
    mode: {
      type: String,
      trim: true,
      default: "owner",
    },
    editor: {
      type: Schema.Types.ObjectId
    }
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
  pair_news: {
    type: Boolean,
    default: false,//LATER - see also getData/pair_item.js and getRecent.js
  },
  primary: {
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
  pair_created: {
    type: Date,
    default: Date.now,
    validate: {
      validator: (value) => {
        return true;
      }
    }
  },
  pair_modified: {
    type: Date,
    default: Date.now,
    validate: {
      validator: (value) => {
        return true;
      }
    }
  },
  init_date: {
    type: Date,
  },
},{timestamp: true, createdAt: "pair_created", updatedAt: "pair_modified"});


const Pair = mongoose.model("pair", pairSchema);

module.exports = Pair;
