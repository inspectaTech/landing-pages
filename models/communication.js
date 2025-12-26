const mongoose = require('mongoose');
// const Schema = mongoose.Schema();
const Schema = mongoose.Schema;

/**
 * used in oauth_server/controllers/users > forgot and verify methods
 */

const communicationSchema = new Schema({
  owner_id: {
    type: Schema.Types.ObjectId,
    validate: {
      validator: (value) => {
        // make sure ObjectId is valid
        return true;
      }
    }
  },
  token: {
    type: String,
    unique: true,
    trim: true
  },
  action: {
    type: String,
    trim: true,
    default: ""
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
  expires: {
    type: Date,
    // default: Date.now,
    validate: {
      validator: (value) => {
        return true;
      }
    }
  },
},{timestamp: true, createdAt: "created", updatedAt: "pair_modified"})

const Communication = mongoose.model("communication", communicationSchema);

module.exports = Communication;