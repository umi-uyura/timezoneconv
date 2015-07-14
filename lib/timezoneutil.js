'use strict';

var _ = require('underscore');
var moment = require('moment-timezone');
require('moment/min/locales');

var timezoneutil = {};

function debug(msg) {
  console.log(msg);
}

/**
 * JSのDateはローカルタイムを生成、ローカルとUTCのみ扱える
 * 他のタイムゾーンの日時として扱いたい場合、擬似的にずらす必要がある
 */

timezoneutil.shiftToTzInfo = function(localTime, toTz) {
  debug('shiftToTz() start --------------------------');

  debug('shiftToTz() - ' + localTime + ' / ' + toTz);

  var toTzOffset = localTime.getTimezoneOffset();

  debug('shiftToTz() - toTzOffset = ' + toTzOffset);

  var toTzTime = moment.tz(localTime, toTz);
  var localUtcOffset = toTzTime.utcOffset();

  debug('shiftToTz() - ' + toTzTime.format() + ' / ' + localUtcOffset);

  toTzOffset = -1 * toTzOffset;

  var baseOffset = (localUtcOffset - toTzOffset);

  debug('shiftToTz() - offset = ' + baseOffset);

  toTzTime.add(baseOffset, 'm');

  var tzInfo = {
    time: toTzTime.toDate(),
    isDST: toTzTime.isDST(),
    utcOffset: toTzTime.utcOffset()
  };

  debug('shiftToTz() - Result = ' + tzInfo.time + ' / ' + tzInfo.utcOffset + ' / ' + tzInfo.isDST);
  debug('shiftToTz() - Result 2 = ' + toTzTime.zoneAbbr());

  return tzInfo;
};

timezoneutil.shiftToTz = function(localTime, toTz) {
  return this.shiftToTzInfo(localTime, toTz).time;
};

/**
 * dの日時はtzゾーンに合わせて変更されていると解釈とした場合のローカルタイムを生成する
 * ※10:00 PDTとして扱ったDateを、ローカルタイムに変換する
 */
timezoneutil.shiftFromTz = function(localtime, fromTz) {
  debug('shiftFromTz() start --------------------------');

  debug('shiftFromTz() - ' + localtime + ' / ' + fromTz);

  var localTzOffset = localtime.getTimezoneOffset();

  debug('shiftFromTz() - localTzOffset = ' + localTzOffset);

  var localTzTime = moment.tz(localtime, fromTz);
  var localUtcOffset = localTzTime.utcOffset();

  debug('shiftFromTz() - ' + localTzTime.format() + ' / ' + localUtcOffset);

  localTzOffset = -1 * localTzOffset;
  var baseOffset = (localUtcOffset - localTzOffset);

  debug('shiftFromTz() - offset = ' + baseOffset);

  localTzTime.add(-1 * baseOffset, 'm');

  var tzTime = localTzTime.toDate();

  debug('shiftFromTz() - Result = ' + tzTime);

  return tzTime;
};


/**
 * tz1に合わせたローカルタイムdをtz2に合わせたローカルタイムに変換する
 */
timezoneutil.convertTZtoTZ = function(localTime, tz1, tz2) {
  return this.convertTZtoTZInfo(localTime, tz1, tz2).time;
};

timezoneutil.convertTZtoTZInfo = function(localTime, tz1, tz2) {
  debug('convertTZtoTZ() start --------------------------');

  debug('convertTZtoTZ() - ' + localTime + ' / ' + tz1 + ' / ' + tz2);

  var localTzOffset = localTime.getTimezoneOffset();

  debug('convertTZtoTZ() - localTzOffset = ' + localTzOffset);

  var tz1Time = moment.tz(localTime, tz1);
  var tz1Offset = tz1Time.utcOffset();

  debug('convertTZtoTZ() - ' + tz1Time.format() + ' / ' + tz1Offset);

  var tz2Time = moment.tz(tz1Time, tz2);
  var tz2Offset = tz2Time.utcOffset();

  debug('convertTZtoTZ() - ' + tz1Time.format() + ' / ' + tz2Offset);
  debug('convertTZtoTZ() - ' + tz2Time.format() + ' / ' + tz2Offset);

  var baseOffset = (tz2Offset - localTzOffset) - (tz1Offset - localTzOffset);

  tz2Time.add(baseOffset, 'm');

  debug('convertTZtoTZ() - offset = ' + baseOffset);

  var tzTime = tz2Time.toDate();

  var tzInfo = {
    time: tz2Time.toDate(),
    isDST: tz2Time.isDST(),
    utcOffset: tz2Time.utcOffset()
  };

  debug('convertTZtoTZ() - Result = ' + tzInfo.time + ' / ' + tzInfo.utcOffset + ' / ' + tzInfo.isDST);
  debug('convertTZtoTZ() - Result 2 = ' + tz2Time.zoneAbbr());

  return tzInfo;
};

module.exports = timezoneutil;
