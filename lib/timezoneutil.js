'use strict';

var _ = require('underscore');
var moment = require('moment-timezone');
require('moment/min/locales');

var timezoneutil = {};

timezoneutil.calcMin2MSec = function(min) {
  return min * 60 * 1000;
};

/**
 * JSのDateはローカルタイムを生成、ローカルとUTCのみ扱える
 * 他のタイムゾーンの日時として扱いたい場合、擬似的にずらす必要がある
 */
timezoneutil.shiftToTz = function(localTime, toTz) {
  console.log('shiftToTz() start --------------------------');

  console.log('shiftToTz() - ' + localTime + ' / ' + toTz);

  var toTzOffset = localTime.getTimezoneOffset();

  console.log('shiftToTz() - toTzOffset = ' + toTzOffset);

  var toTzTime = moment.tz(localTime, toTz);
  var localUtcOffset = toTzTime.utcOffset();

  console.log('shiftToTz() - ' + toTzTime.format() + ' / ' + localUtcOffset);

  toTzOffset = -1 * toTzOffset;
  var baseOffset = (localUtcOffset - toTzOffset);

  console.log('shiftToTz() - offset = ' + baseOffset);

  toTzTime.add(baseOffset, 'm');

  var tzTime = toTzTime.toDate();

  console.log('shiftToTz() - Result = ' + tzTime);

  return tzTime;
};

/**
 * dの日時はtzゾーンに合わせて変更されていると解釈とした場合のローカルタイムを生成する
 * ※10:00 PDTとして扱ったDateを、ローカルタイムに変換する
 */
timezoneutil.shiftFromTz = function(localtime, fromTz) {
  console.log('shiftFromTz() start --------------------------');

  console.log('shiftFromTz() - ' + localtime + ' / ' + fromTz);

  var localTzOffset = localtime.getTimezoneOffset();

  console.log('shiftFromTz() - localTzOffset = ' + localTzOffset);

  var localTzTime = moment.tz(localtime, fromTz);
  var localUtcOffset = localTzTime.utcOffset();

  console.log('shiftFromTz() - ' + localTzTime.format() + ' / ' + localUtcOffset);

  localTzOffset = -1 * localTzOffset;
  var baseOffset = (localUtcOffset - localTzOffset);

  console.log('shiftFromTz() - offset = ' + baseOffset);

  localTzTime.add(-1 * baseOffset, 'm');

  var tzTime = localTzTime.toDate();

  console.log('shiftFromTz() - Result = ' + tzTime);

  return tzTime;
};


/**
 * tz1に合わせたローカルタイムdをtz2に合わせたローカルタイムに変換する
 */
timezoneutil.convertTZtoTZ = function(localTime, tz1, tz2) {
  console.log('convertTZtoTZ() start --------------------------');

  console.log('convertTZtoTZ() - ' + localTime + ' / ' + tz1 + ' / ' + tz2);

  var localTzOffset = localTime.getTimezoneOffset();

  console.log('convertTZtoTZ() - localTzOffset = ' + localTzOffset);

  var tz1Time = moment.tz(localTime, tz1);
  var tz1Offset = tz1Time.utcOffset();

  console.log('convertTZtoTZ() - ' + tz1Time.format() + ' / ' + tz1Offset);

  var tz2Time = moment.tz(tz1Time, tz2);
  var tz2Offset = tz2Time.utcOffset();

  console.log('convertTZtoTZ() - ' + tz1Time.format() + ' / ' + tz2Offset);
  console.log('convertTZtoTZ() - ' + tz2Time.format() + ' / ' + tz2Offset);

  var baseOffset = (tz2Offset - localTzOffset) - (tz1Offset - localTzOffset);

  tz2Time.add(baseOffset, 'm');

  console.log('convertTZtoTZ() - offset = ' + baseOffset);

  var tzTime = tz2Time.toDate();

  console.log('convertTZtoTZ() - Result = ' + tzTime);

  return tzTime;
};

module.exports = timezoneutil;
