const mongoose = require('mongoose');
// const Schema = mongoose.Schema();
const Schema = mongoose.Schema;

const actionSchema = new Schema({
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

const Action = mongoose.model("action", actionSchema);

module.exports = Action;
