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
  }
});


const Pair = mongoose.model("pair", pairSchema);

module.exports = Pair;
