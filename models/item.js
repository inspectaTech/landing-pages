  const mongoose = require('mongoose');
  const Schema = mongoose.Schema;
  const preset_defaults = require('../core/check-make/preset_defaults');
  // const removeSomething = require('../controllers/lib/getData/remove_something');
  // const testAlias = require('../controllers/lib/getData/test_alias');// cant reference itself

  const itemSchema = new Schema({
    type: {
      type: String,
      trim: true
    },
    data_type: {
      type: String,
      trim: true
    },
    user_id: {
      type: Schema.Types.ObjectId
    },
    project_id: {
      type: Schema.Types.ObjectId
    },
    category: {
      type: String,
      trim: true,
      default: ""
    },
    ancestor: {
      type: Schema.Types.ObjectId
    },
    ancestor2: {
      type: String,
      trim: true
    },
    title_data: {
      type: String,
      trim: true,
      default: ""
    },
    core_data: {
      type: String,
      trim: true,
      default: ""
    },
    desc_data: {
      type: String,
      trim: true,
      default: ""
    },
    url_data: {
      type: String,
      trim: true,
      default: ""
    },
    img_url: {
      type: String,
      trim: true,
      default: ""
    },
    other_data: {
      type: String,
      trim: true,
      default: ""
    },
    note_enabled: {
      type: Boolean,
      default: true
    },
    note_data: {
      type: Schema.Types.Mixed,
      default: {editor: "", text_data: ""}
    },
    caption: {
      type: String,
      trim: true,
      default: ""
    },
    wim: {
      type: String,
      trim: true,
      default: ""
    },
    code_enabled: {
      type: Boolean,
      default: false
    },
    code_data: {
      type: Schema.Types.Mixed,
      default: {editor: "", text_data: ""}
    },
    tag_data: {
      type: Array,
      trim: true,
      default: []
    },
    meta_data: {
      type: Schema.Types.Mixed,
      trim: true,
      default: ""/*,
      validate()*/
    },
    tasks_enabled:{
      type: Boolean,
      default: false
    },
    task_data: {
      type: Schema.Types.Mixed,
      default: {ids:[], data:{}, display: true, section: false}
    },
    links_enabled: {
      type: Boolean,
      default: true
    },
    links: {
      type: Schema.Types.Mixed,
      default: {ids:[],data:{}}
    },
    comments_enabled: {
      type: Boolean,
      default: true
    },
    discussion_enabled: {
      type: Boolean,
      default: true
    },
    chat_data: {
      type: Schema.Types.Mixed,
      default: { chat_ref: "inherit", chat_ref_id: null, video_ref: "inherit", video_ref_id: null}
      /** chat_data holds meeting and discussion settings - differs from comments */
    },
    config_data: {
      type: Schema.Types.Mixed,
      auto_img: {
        type: Boolean,
        trim: true,
        default: true
      },
      img_enabled: {
        type: Boolean,
        trim: true,
        default: true
      }
    },
    tool: {
      type: Schema.Types.Mixed,
      name: {
        type:String,
        trim: true,
        default: preset_defaults.preset.default.tool.name
      },
      template: {
        type:String,
        trim: true,
        default: preset_defaults.preset.default.tool.template
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
    },
    is_event:{
      type: Boolean,
      default: false
    },
    event_date:{
      type: Date,
    },
    event_data: {
      type: Schema.Types.Mixed,
      label: {
        type: String,
        default: "event"
      },
      active:{
        type: Boolean,
        default: false
      }, 
      start: {
        type: Date,
      },
      end: {
        type: Date,
      },
    },
    icon: {
      type: String,
      default: ""
    },
    text_only:{
      type: Boolean,
      default: false
    },
    published: {
      type: Boolean,
      default: false
    },
    news: {
      type: Boolean,
      default: false
    },
    extra: {
      type: Schema.Types.Mixed,
      url: {
        type:String,
        trim: true
      },
      data: {
        type: Schema.Types.Mixed,
      },
    },
    notification: {
      type: String,
      default: ""
    },
    params: {
      type: Schema.Types.Mixed
    },
    admin: {
      type: Boolean,
      default: false
    },
    root: {
      type: Boolean,
      default: false
    },
    container: {
      type: Boolean,
      default: false
    },
    order: {
      type: Number,
      default: 0
    },
    priority: {
      type: Number,
      default: 0
    },
    review: {
      type: Number,
      default: 0
    },
    filter: {
      type: String,
      trim: true,
      default:"custom_created"
    },
    alias:{
      type: String,
      trim: true,
      unique: true
    },
    path:{
      type: String,
      trim: true,
    },
    preset_id: {
      type: Schema.Types.ObjectId
    },
    pin: {
      type: Boolean,
      default: false
    },
    pin_expires: {
      type: Date,
    },
    pin_archive: {
      type: Boolean,
      default: false
    },
    archive: {
      type: Boolean,
      default: false
    },
    progress: {
      type: Schema.Types.Mixed,
      active: {
        type: Boolean,
        default: false
      },
      status: {
        type:String,
        trim: true,
        default: "pending"
      }
    },
    deprecated_data:{
        type: Schema.Types.Mixed,
        id: {
          type:String,
          trim: true
        },
        data_id: {
          type:String,
          trim: true
        },
        user_id: {
          type:String,
          trim: true
        },
        ancestor:{
          type:String,
          trim: true
        }
    }
  },{timestamp: true, createdAt: "created", updatedAt: "modified"});

  itemSchema.index({'$**': 'text'});


  // itemSchema.pre('save', async function(next){
  //
  //   // let alias_title = removeSomething(this.title_data,' ','-');
  //   // let test_alias = escape(`${this.user_id.toString()}/${alias_title}`);
  //   // let path = escape(`${alias_title}`);
  //   //
  //   // // arc_input.alias = testAlias(req.user._id,`${req.user._id.toString()}/${alias_title}`);
  //   // let prep_alias = await testAlias({ mode: "add", user_id: this.user_id, test: test_alias, path, data: this });
  //   // this.alias = prep_alias.alias;
  //   // this.path = prep_alias.path;
  //
  //   next();
  // })

  const Item = mongoose.model("item", itemSchema);

  module.exports = Item;
