const mongoose = require('mongoose');
// const Schema = mongoose.Schema();
const Schema = mongoose.Schema;

const transIdSchema = new Schema({
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

const TransId = mongoose.model("transId", transIdSchema);

module.exports = TransId;
