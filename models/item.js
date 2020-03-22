  const mongoose = require('mongoose');
  const Schema = mongoose.Schema;
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
    note_data: {
      type: String,
      trim: true,
      default: ""
    },
    tag_data: {
      type: String,
      trim: true,
      default: ""
    },
    meta_data: {
      type: Schema.Types.Mixed,
      trim: true,
      default: ""/*,
      validate()*/
    },
    task_data: {
      type: String,
      trim: true,
      default: ""
    },
    tool: {
      type: Schema.Types.Mixed,
      name: {
        type:String,
        trim: true
      },
      template: {
        type:String,
        trim: true
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
    picture: {
      type: String,
      default: ""
    },
    published: {
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
    filter: {
      type: String,
      trim: true,
      default:"alpha"
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
