const mongoose = require('mongoose');
// const Schema = mongoose.Schema();
const Schema = mongoose.Schema;

const actionSchema = new Schema({
  who: {
    // owner_id
    type: Schema.Types.ObjectId,
    validate: {
      validator: (value) => {
        // make sure ObjectId is valid
        return true;
      }
    }
  },
  what: {
    // descriptive string message of what action occured
    type: String,
  },
  where:{
    // host_id (project, user, organization)
    type: Schema.Types.ObjectId
  },
  data_id: {
    /**
     * data id is the id reference to the thing being reported 
     * (it may provide a link to the material)
     */
    type: Schema.Types.ObjectId,
  },
  data_type: {
    type: String,
  },
  variant: {
    type: String,
  },
  to: {
    type: String,
  },
  to_ids: {
    type: Array,
    default: [],
  },
  when: {
    type: Date,
    default: Date.now,
    validate: {
      validator: (value) => {
        // can i write an expiration value here and save it to expires?
        return true;
      }
    }
  },
  expires: {
    type: Date,
    default: Date.now,
    validate: {
      validator: (value) => {
        return true;
      }
    }
  },
},{timestamp: true, createdAt: "when"/*, updatedAt: "pair_modified"*/});

const Action = mongoose.model("action", actionSchema);

module.exports = Action;
