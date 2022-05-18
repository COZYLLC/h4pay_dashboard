function addTime(date, hours, minutes, seconds) {
  date.setHours(date.getHours() + hours);
  date.setMinutes(date.getMinutes() + minutes);
  date.setSeconds(date.getSeconds() + seconds);
  return date;
}
module.exports.addTime = addTime;
