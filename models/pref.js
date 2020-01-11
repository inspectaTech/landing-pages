const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const prefSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    required:true,
    unique: true
  },
  prefs:{
    type: Schema.Types.Mixed
  },
  bookmarks:{
    type: Schema.Types.Mixed
  },
  filter: {
    "m-0":{
      type: String,
      trim: true,
      default: "alpha"
    },
    "i-0":{
      type: String,
      trim: true,
      default: "alpha"
    },
    "g-0":{
      type: String,
      trim: true,
      default: "alpha"
    },
  },
})

const Pref = mongoose.model("pref", prefSchema);

module.exports = Pref;
