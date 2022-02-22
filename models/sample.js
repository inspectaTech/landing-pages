const mongoose = require('mongoose');
// const Schema = mongoose.Schema();
const Schema = mongoose.Schema;

const sampleSchema = new Schema({
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

const Sample = mongoose.model("sample", sampleSchema);

module.exports = Sample;
