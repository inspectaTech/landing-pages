const mongoose = require('mongoose');
// const Schema = mongoose.Schema();
const Schema = mongoose.Schema;

const tipSchema = new Schema({
  owner_id: {
    type: Schema.Types.ObjectId,
    validate: {
      validator: (value) => {
        // make sure ObjectId is valid
        return true;
      }
    }
  },
  data_id: {
    type: String,
    unique: true,
    trim: true
  }
})

const Tip = mongoose.model("tip", tipSchema);

module.exports = Tip;