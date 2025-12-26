const mongoose = require('mongoose');
// const Schema = mongoose.Schema();
const Schema = mongoose.Schema;

const kanbanSchema = new Schema({
  stage_ids: {
    type: Array,
    default: []
  },
  board_data: {
    type: Schema.Types.Mixed,
    default: {}
  },
})

const Kanban = mongoose.model("kanban", kanbanSchema);

module.exports = Kanban;
