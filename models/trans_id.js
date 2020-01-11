const mongoose = require('mongoose');
const Schema = mongoose.Schema();

const transIdSchema = new Schema({
  data_id: {
    type: String,
    unique: true,
    trim: true
  }
})

const TransId = mongoose.model("transId", transIdSchema);

module.exports = TransId;
