
const toTimestamp = (date) => {
  let date_obj = new Date(date);
  return date_obj.getTime();
}

module.exports = { toTimestamp };
