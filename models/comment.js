const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    validate: {
      validator: (value) => {
        // make sure ObjectId is valid
        return true;
      }
    }
  },
  preset_id: {
    type: Schema.Types.ObjectId,
    validate: {
      validator: (value) => {
        // make sure ObjectId is valid
        return true;
      }
    }
  },
  user_id: {
    type: Schema.Types.ObjectId,
    validate: {
      validator: (value) => {
        // make sure ObjectId is valid
        return true;
      }
    }
  },
  project_id: {
    type: Schema.Types.ObjectId,
    validate: {
      validator: (value) => {
        // make sure ObjectId is valid
        return true;
      }
    }
  },
  item_id: {
    // like the room id or the item the comments are connected to
    type: Schema.Types.ObjectId,
    validate: {
      validator: (value) => {
        // make sure ObjectId is valid
        return true;
      }
    }
  },
  access: {
    // who can read this comment
    type: Array
  },
  payload: {
    // who can modify this project
    type: Schema.Types.Mixed,
    text: {
      type: String,
    },
    height: {
      type: Number
    }
  },
  topic_id: {
    type: Schema.Types.ObjectId,
    validate: {
      validator: (value) => {
        // make sure ObjectId is valid
        return true;
      }
    }
  },
  reply_id: {
    type: Schema.Types.ObjectId,
    validate: {
      validator: (value) => {
        // make sure ObjectId is valid
        return true;
      }
    }
  },
  ref_id: {
    type: Schema.Types.ObjectId,
    validate: {
      validator: (value) => {
        // make sure ObjectId is valid
        return true;
      }
    }
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
  }
},{timestamp: true, createdAt: "created", updatedAt: "modified"})

commentSchema.index({'$**': 'text'});// search text

const Comment = mongoose.model("comment", commentSchema);

module.exports = Comment;
