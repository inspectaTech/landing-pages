const mongoose = require('mongoose');
// const Schema = mongoose.Schema();
const Schema = mongoose.Schema;

const networkSchema = new Schema({
  host: {
    // the target project to link to
    type: Schema.Types.Mixed,
    // what intity is doing the linking
    id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    owner_id: {
      type: Schema.Types.ObjectId,
    },
  },
  link: {
    // the person or project that wants link network
    type: Schema.Types.Mixed,
    id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    owner_id: {
      type: Schema.Types.ObjectId,
    },
  },
  invite: {
    // this document is created by the host to the link
    type: Schema.Types.Mixed,
    active:{
      type: Boolean,
      default: false,
    },
    invite_id: {
      type: Schema.Types.ObjectId
    },
    invite_date: {
      type: Date,
    },
    network: {
      // what level of network is being invited?
      type: String,
      default: "",
    },
    hide: {
      type: Boolean,
      default: null
    },
  },
  request: {
    // this document is created by the host to the link
    type: Schema.Types.Mixed,
    active: {
      type: Boolean,
      default: false,
    },
    request_id: {
      type: Schema.Types.ObjectId
    },
    request_date: {
      type: Date,
    },
    network: {
      // what level of network is being requested?
      type: String,
      default: "",
    },
    hide: {
      type: Boolean,
      default: false
    },
  },
  watch: {
    type: Schema.Types.Mixed,
    active: {
      type: Boolean,
      default: false,
    },
    active_date: {
      type: Date,
    },
  },
  mute: {
    type: Schema.Types.Mixed,
    active: {
      type: Boolean,
      default: false,
    },
    approve_id:{
      type: Schema.Types.ObjectId
    },
     active_date: {
      type: Date,
    },
  },
  block: {
    type: Schema.Types.Mixed,
    active: {
      type: Boolean,
      default: false,
    },
    approve_id:{
      type: Schema.Types.ObjectId
    },
     active_date: {
      type: Date,
    },
  },
  support: {
    type: Schema.Types.Mixed,
    active: {
      type: Boolean,
      default: false,
    },
    active_date: {
      type: Date,
    },
    approve_id:{
      type: Schema.Types.ObjectId
    },
  },
  subscribe: {
    type: Schema.Types.Mixed,
    active: {
      type: Boolean,
      default: false,
    },
    active_date: {
      type: Date,
    },
    approve_id:{
      type: Schema.Types.ObjectId
    }
  },
  join: {
    type: Schema.Types.Mixed,
    active: {
      type: Boolean,
      default: false,
    },
    active_date: {
      type: Date,
    },
    approve_id:{
      type: Schema.Types.ObjectId
    }
  },
  edit: {
    type: Schema.Types.Mixed,
    active: {
      type: Boolean,
      default: false,
    },
    active_date: {
      type: Date,
    },
    approve_id:{
      type: Schema.Types.ObjectId
    }
  },
  admin: {
    type: Schema.Types.Mixed,
    active: {
      type: Boolean,
      default: false,
    },
    active_date: {
      type: Date,
    },
    approve_id:{
      type: Schema.Types.ObjectId
    }
  },
});

  networkSchema.pre('save', async function(next){
  
    const ObjectId = mongoose.Types.ObjectId;
    // if (ObjectId.isValid(id)) {
    //   if (String(new ObjectId(id)) === id) {
    //     return true
    //   } else {
    //     return false
    //   }
    // } else {
    //   return false
    // }
    if (this.link.id && typeof this.link.id == "string") this.link.id = new ObjectId(this.link.id);
    if (this.host.id && typeof this.host.id == "string") this.host.id = new ObjectId(this.host.id);
  
    next();
  })

const Network = mongoose.model("network", networkSchema);

module.exports = Network;
