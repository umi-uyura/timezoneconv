'use strict';

var tzutil = require('lib/timezoneutil');

// Pacific/Honolulu -10:00
// America/Los_Angeles -8:00
// Europe/Dublin +5:30
// Asia/Shanghai +8:00
// Asia/Tokyo +9:00
// Asia/Sakhalin + 10:00

var d = new Date();

// tzutil.shiftToTz(d, 'Asia/Shanghai');
// tzutil.shiftToTz(d, 'Asia/Sakhalin');
// tzutil.shiftToTz(d, 'America/Los_Angeles');
// tzutil.shiftToTz(d, 'Europe/Dublin');
// tzutil.shiftToTz(d, 'Pacific/Honolulu');
// tzutil.shiftToTz(d, 'UTC');
// tzutil.shiftToTz(d, 'Asia/Tokyo');

tzutil.shiftFromTz(new Date('Thu Jul 09 2015 17:03:05 GMT+0900'), 'Asia/Shanghai');
tzutil.shiftFromTz(new Date('Thu Jul 09 2015 19:03:05 GMT+0900'), 'Asia/Sakhalin');
tzutil.shiftFromTz(new Date('Thu Jul 09 2015 02:03:05 GMT+0900'), 'America/Los_Angeles');
tzutil.shiftFromTz(new Date('Thu Jul 09 2015 10:03:05 GMT+0900'), 'Europe/Dublin');
tzutil.shiftFromTz(new Date('Wed Jul 08 2015 23:03:05 GMT+0900'), 'Pacific/Honolulu');
tzutil.shiftFromTz(new Date('Thu Jul 09 2015 09:03:05 GMT+0900'), 'UTC');
tzutil.shiftFromTz(new Date('Thu Jul 09 2015 18:03:05 GMT+0900'), 'Asia/Tokyo');

// tzutil.convertTZtoTZ(d, 'Asia/Shanghai', 'Asia/Sakhalin');
// tzutil.convertTZtoTZ(d, 'Asia/Sakhalin', 'Asia/Shanghai');
// tzutil.convertTZtoTZ(d, 'Asia/Sakhalin', 'America/Los_Angeles');
// tzutil.convertTZtoTZ(d, 'America/Los_Angeles', 'Asia/Shanghai');
// tzutil.convertTZtoTZ(d, 'Asia/Tokyo', 'UTC');
// tzutil.convertTZtoTZ(d, 'UTC', 'Asia/Tokyo');
