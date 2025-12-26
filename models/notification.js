const mongoose = require('mongoose');
// const Schema = mongoose.Schema();
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  owner_id: {
    type: Schema.Types.ObjectId,
    validate: {
      validator: (value) => {
        // make sure ObjectId is valid
        return true;
      }
    }
  },
  tokens: {
    type: Schema.Types.Mixed,
    default: {}
    // type: Array,
    // trim: true,
    // default: []
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
  },
},{timestamp: true, createdAt: "created", updatedAt: "modified"})

const notification = mongoose.model("notification", notificationSchema);

module.exports = notification;