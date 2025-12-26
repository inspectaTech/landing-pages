const mongoose = require('mongoose');
// const Schema = mongoose.Schema();
const Schema = mongoose.Schema;

const calendarSchema = new Schema({
  ref_id: {
    // item._id
    type: Schema.Types.ObjectId
  },
  user_id: {
    type: Schema.Types.ObjectId
  },
  project_id: {
    type: Schema.Types.ObjectId
  },
  active: {
    type: Boolean,
    default: true
  },
  start: {
    type: Date,
  },
  end: {
    type: Date,
  },
  dates: {
    type: Schema.Types.Mixed,
    default: {}
  },
})

const Calendar = mongoose.model("calendar", calendarSchema);

module.exports = Calendar;
