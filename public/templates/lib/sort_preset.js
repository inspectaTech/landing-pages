  const {exists} = require('./exists');

  export const sort_preset = ({data, type}) => {
    return data.filter((entry) => {
      return exists(entry.data_type) && entry.data_type == type;
    });
  }
