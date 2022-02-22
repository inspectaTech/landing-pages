const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const prefSchema = new Schema({
  project_id: {
    type: Schema.Types.ObjectId,
    required:true,
    unique: true
  },
  prefs:{
    type: Schema.Types.Mixed
  },
  bookmarks:{
    type: Schema.Types.Mixed,
    default:{
      protected:["bookmarks"],
      active:"bookmarks",
      bookmarks:{
        icon:"bookmark2",
        data:[]
      }
    }
  },
  filter: {
    "m-0":{
      type: String,
      trim: true,
      default: "alpha"
    },
    "i-0":{
      type: String,
      trim: true,
      default: "alpha"
    },
    "g-0":{
      type: String,
      trim: true,
      default: "alpha"
    },
  },
  section_views:{
    type: Array,
    default:[
      "profile_profile",
      "recent_recent",
      "library_library"
    ]
  },
  section_data:{
    type: Schema.Types.Mixed,
    default:{
      "profile_profile":{
        type:"profile", name: "profile", icon: "user", home: false, owner: true, guest:"public"
      },
      "recent_recent":{
        type:"recent", name:"recent", icon:"clock", home:false, owner: true, guest:"published"
      },
      "library_library":{
        type:"library", name: "", icon: "books", home: true, owner: true, guest:"private"
      }
    }
  },
  section_home:{
    type: String,
    trim: true,
    default: "library"
  }
})

const Pref = mongoose.model("pref", prefSchema);

module.exports = Pref;
