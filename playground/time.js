var moment = require('moment');

// Jan 1st 1970 00:00:00 am

// var date = new Date();
// console.log(date.getMonth());

// var date = moment();

// date.add(100, 'year').subtract(9, 'month')
// console.log(date.format("dddd, MMMM Do YYYY, h:mm:ss a"))

var someTimestamp = moment().valueOf();
console.log(someTimestamp);

var createdAt = 1234
var date = moment(createdAt);

console.log(date.format('h:mm a'))