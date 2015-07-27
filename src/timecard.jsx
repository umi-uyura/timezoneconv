'use strict';

var React = require('react');
var mui = require('material-ui');
var moment = require('moment-timezone');
require('moment/min/locales');
var _ = require('underscore');
var tzutil = require('../lib/timezone-util');

var Paper = mui.Paper;
var TextField = mui.TextField;
var DatePicker = mui.DatePicker;
var DualTimePicker = require('./dualtimepicker.jsx');
var Colors = mui.Styles.Colors;

var util = require('util');

var TimeCard = React.createClass({
  getDefaultProps: function() {
    return {
      fromto: 'from',
      basetime: new Date(),
      tz: 'UTC',
      lang: 'en',
      tzItems: [],
      tzAbbrs: []
    };
  },
  propTypes: {
    fromto: React.PropTypes.string.isRequired,
    basetime: React.PropTypes.object.isRequired,
    tz: React.PropTypes.string.isRequired,
    lang: React.PropTypes.string,
    tzItems: React.PropTypes.array,
    tzAbbrs: React.PropTypes.array,
    onChange: React.PropTypes.func.isRequired
  },
  componentWillMount: function() {
    moment.locale(this.props.lang);
  },
  setTimeFormat: function(format) {
    this.refs.timepicker.setState({ format24hr: (format === '24hr') });
  },
  _onChangeDate: function(e, v) {
    var t = this.props.basetime;
    t.setFullYear(v.getFullYear());
    t.setMonth(v.getMonth());
    t.setDate(v.getDate());

    var ndt = this.shiftFromTz(t, this.props.tz);

    this.props.onChange(e, {
      time: ndt,
      tz: this.props.tz
    });
  },
  _onChangeTime: function(e, v) {
    console.log('TimeCard::_onChangeTime() - ' + this.props.basetime + ' / ' + this.props.tz);
    console.log('TimeCard::_onChangeTime() input - ' + e + ' / ' + v);
    var t = this.props.basetime;
    t.setHours(v.getHours());
    t.setMinutes(v.getMinutes());

    var ndt = this.shiftFromTz(t, this.props.tz);

    this.props.onChange(e, {
      time: ndt,
      tz: this.props.tz
    });
  },
  _onChangeTZ: function(v) {
    var changeTZ = v.target.value;
    if (_.contains(this.props.tzItems, changeTZ) || _.find(this.props.tzAbbrs, {abbr: changeTZ})) {
      console.log('Timecard::onChangeTZ() - Hit! = ' + changeTZ + ' <- ' + this.props.tz);
      console.log('Timecard::onChangeTZ() - Base Time = ' + this.props.basetime);

      var d = this.refs.datepicker.getDate();
      var t = this.refs.timepicker.getTime();
      var dt = new Date(d.getFullYear(), d.getMonth(), d.getDate(), t.getHours(), t.getMinutes());
      console.log('TimeCard::onChangeTZ() - Date = ' + d + '\n/ Time = ' + t + '\n/ ' + dt);

      var ndt = this.shiftFromTz(dt, changeTZ);
      console.log('TimeCard::onChangeTZ() - ndt = ' + ndt);

      this.props.onChange(null, {
        time: ndt,
        tz: changeTZ
      });
    }
  },
  shiftToTzInfo: function(localTime, tz) {
    var info = _.findWhere(this.props.tzAbbrs, {abbr: tz});
    if (info) {
      info.time = tzutil.convertOffsetToOffset(localTime,
                                               tzutil.canonicalizeJsDateOffseet(localTime.getTimezoneOffset()),
                                               info.offsets[0].offset);
      info.utcOffset = info.offsets[0].offset;
      info.isDST = false;    // TODO: 略名時の夏時間判定（→別データを用意するしか無い）
    } else {
      info = tzutil.shiftToTzInfo(localTime, tz);
    }
    return info;
  },
  shiftFromTz: function(time, tz) {
    var info = _.findWhere(this.props.tzAbbrs, {abbr: tz});
    if (info) {
      var ndt = tzutil.convertOffsetToOffset(time,
                                             tzutil.canonicalizeJsDateOffseet(time.getTimezoneOffset()),
                                             info.offsets[0].offset);
      return ndt;
    } else {
      var ndt2 = tzutil.shiftFromTz(time, tz);
      return ndt2;
    }
  },
  formatDate: function(d) {
    var m = moment(d);
    return m.format('l (ddd)');
  },
  render: function() {
    var styles = {
      card: {
        margin: '8px',
        padding: '8px',
        textAlign: 'center'
      },
      tzwrapper: {
        position: 'relative',
        width: '256px',
        margin: '0 auto'
      },
      timezone: {
        display: 'block',
        margin: '0 auto'
      },
      dst: {
        position: 'absolute',
        top: '16px',
        right: '0px',
        padding: '0 4px',
        fontSize: 'small',
        color: Colors.grey400,
        backgroundColor: 'white'
      }
    };

    console.log('TimeCard::render() ' + this.props.fromto + ' / ' + this.props.basetime);

    /* var disabled = this.props.fromto === 'to'; */
    var disabled = false;

    var info = this.shiftToTzInfo(this.props.basetime, this.props.tz);
    console.log('TimeCard::render() - shifted ' + this.props.fromto + ' / ' + info.time + ' / ' + info.utcOffset + ' / ' + info.isDST + ' / ' + this.props.tz);

    return (
      <Paper style={styles.card} zDepth={2}>
        <DatePicker ref="datepicker"
                    formatDate={this.formatDate}
                    defaultDate={info.time}
                    autoOk={true}
                    disabled={disabled}
                    onChange={this._onChangeDate} />
        <DualTimePicker ref="timepicker"
                        initialTime={info.time}
                        initialUtcOffset={info.utcOffset}
                        lang={this.props.lang}
                        disabled={disabled}
                        onChange={this._onChangeTime} />
        <div style={styles.tzwrapper}>
          <TextField ref="tzfield"
                     style={styles.timezone}
                     defaultValue={this.props.tz}
                     onChange={this._onChangeTZ} />
          <div style={styles.dst}>
            {info.isDST ? '夏時間' : ''}
          </div>
        </div>
      </Paper>
    );
  }
});

module.exports = TimeCard;
