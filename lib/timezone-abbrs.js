'use strict';

var _ = require('underscore');

var timezone_abbrs = {};

timezone_abbrs.abbrs = function() {
  var tzjson = require('node_modules/moment-timezone/data/unpacked/latest.json');
  return this.loadAbbrs(tzjson);
};

timezone_abbrs.loadAbbrs = function(json) {
  var abbrTzArray = [];

  _.each(json.zones, function(v) {
    var name = v.name;
    var abbrs_length = v.abbrs.length;

    for (var i = 0; i < abbrs_length; i++) {
      var abbr = v.abbrs[i];
      var offset = v.offsets[i];

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


module.exports = timezone_abbrs;
