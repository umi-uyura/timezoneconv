'use strict';

var _ = require('underscore');

var TimezoneAbbrs = {};

TimezoneAbbrs.abbrs = function() {
  var tzjson = require('moment-timezone/data/unpacked/latest.json');
  return this.loadAbbrs(tzjson);
};

TimezoneAbbrs.loadAbbrs = function(json) {
  var abbrTzArray = [];

  _.each(json.zones, function(v) {
    var name = v.name;
    var abbrsLength = v.abbrs.length;

    for (var i = 0; i < abbrsLength; i++) {
      var abbr = v.abbrs[i];
      var offset = v.offsets[i];
      offset = -1 * offset;

      var idx = _.findIndex(abbrTzArray, {abbr: abbr});

      var data = 0 <= idx ? abbrTzArray[idx] : null;
      if (!data) {
        data = {abbr: abbr, offsets: []};
      }

      var offsetIdx = _.findIndex(data.offsets, {offset: offset});

      var dataOffset = 0 <= offsetIdx ? data.offsets[offsetIdx] : null;
      if (!dataOffset) {
        dataOffset = {offset: offset, names: []};
      }

      if (!_.contains(dataOffset.names, name)) {
        dataOffset.names.push(name);
      }

      if (0 <= offsetIdx) {
        data.offsets[offsetIdx] = dataOffset;
      } else {
        data.offsets.push(dataOffset);
      }

      if (0 <= idx) {
        abbrTzArray[idx] = data;
      } else {
        abbrTzArray.push(data);
      }
    }
  });

  var abbrs = {};
  abbrs.list = abbrTzArray;
  abbrs.version = json.version;

  return abbrs;
};

module.exports = TimezoneAbbrs;
