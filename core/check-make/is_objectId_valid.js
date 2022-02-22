  const mongoose = require('mongoose');

  const is_objectId_valid = async function(id)
  {
    // 12 character strings create a false valid using mongoose isValid
    // let isValid = mongoose.Types.ObjectId.isValid;

    const ObjectId = await mongoose.Types.ObjectId;
    if (ObjectId.isValid(id)) {
      if (String(new ObjectId(id)) === id)
      {
        return true
      } else {
         return false
      }
    } else {
      return false
    }
  }// is_objectId_valid

  module.exports = {is_objectId_valid};
