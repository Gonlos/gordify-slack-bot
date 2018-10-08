const daysOfWeek = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday"
];
const daysToCron = days => {
  if (days == "") return "*";
  return days
    .split(",")
    .map(e => daysOfWeek.indexOf(e))
    .toString();
};

const timeToCron = time => {
  parseTime = [0, 0];
  return time.split(":").forEach((e, i) => (parseTime[i] = parseInt(e)));
};

const shortDayToLong=(day)=>{
  if(day.length<2) return ""
  index= daysOfWeek.findIndex(e=>e.includes(day))
  if(index<0) return ""
  return daysOfWeek[index]
}
module.exports = { shortDayToLong, daysOfWeek, timeToCron, daysToCron };