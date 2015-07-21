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

var TimeCard = React.createClass({
  getDefaultProps: function() {
    return {
      fromto: 'from',
      initialTime: new Date(),
      lang: 'en',
      initialTz: 'UTC',
      tzItems: [],
      tzAbbrs: []
    };
  },
  propTypes: {
    fromto: React.PropTypes.string.isRequired,
    initialTime: React.PropTypes.object,
    lang: React.PropTypes.string,
    initialTz: React.PropTypes.string,
    tzItems: React.PropTypes.array,
    tzAbbrs: React.PropTypes.array,
    onChange: React.PropTypes.func.isRequired
  },
  getInitialState: function() {
    var info = this.shiftToTzInfo(this.props.initialTime, this.props.initialTz);

    return {
      time: info.time,
      tz: this.props.initialTz,
      utcOffset: info.utcOffset,
      isDst: info.isDst
    };
  },
  componentWillMount: function() {
    moment.locale(this.props.lang);
  },
  setTimeFormat: function(format) {
    this.refs.timepicker.setState({ format24hr: (format === '24hr') });
  },
  setDateTime: function(dt) {
    console.log('TimeCard::setDateTime() set - ' + dt);
    var info = this.shiftToTzInfo(dt, this.state.tz);

    console.log('TimeCard::setDateTime() disp - ' + info.time);

    this.setState({
      time: dt,
      utcOffset: info.utcOffset,
      isDST: info.isDST
    });

    this.refs.datepicker.setDate(info.time);
    this.refs.timepicker.setTime(info.time, info.utcOffset);
  },
  _onChangeDate: function(e, v) {
    var t = this.state.time;
    t.setFullYear(v.getFullYear());
    t.setMonth(v.getMonth());
    t.setDate(v.getDate());

    var ndt = tzutil.shiftFromTz(t, this.state.tz);
    var info = this.shiftToTzInfo(ndt, this.state.tz);

    this.setState({
      time: ndt,
      utcOffset: info.utcOffset,
      isDST: info.isDST
    });

    this.refs.timepicker.setTime(info.time, info.utcOffset);

    this.props.onChange(e, ndt);
  },
  _onChangeTime: function(e, v) {
    console.log('TimeCard::_onChangeTime() - ' + this.state.time + ' / ' + this.state.tz);
    console.log('TimeCard::_onChangeTime() input - ' + e + ' / ' + v);
    var t = this.state.time;
    t.setHours(v.getHours());
    t.setMinutes(v.getMinutes());

    var ndt = tzutil.shiftFromTz(t, this.state.tz);
    var info = this.shiftToTzInfo(ndt, this.state.tz);
    console.log('TimeCard::_onChangeTime() shift - ' + ndt);

    this.setState({
      time: t,
      utcOffset: info.utcOffset,
      isDST: info.isDST
    });

    this.props.onChange(e, ndt);
  },
  _onChangeTZ: function(v) {
    var changeTZ = v.target.value;
    if (_.contains(this.props.tzItems, changeTZ)) {
      console.log('Timecard::onChangeTZ() - Hit! = ' + changeTZ + ' <- ' + this.state.tz);

      var changeTime = tzutil.convertTZtoTZInfo(this.state.time, this.state.tz, changeTZ);
      console.log('Timecard::onChangeTZ() - changeTime = ' + changeTime.time + ' / ' + changeTime.utcOffset + ' / ' + changeTime.isDST);

      changeTime.time.setFullYear(this.state.time.getFullYear());
      changeTime.time.setMonth(this.state.time.getMonth());
      changeTime.time.setDate(this.state.time.getDate());
      changeTime.time.setHours(this.state.time.getHours());
      changeTime.time.setMinutes(this.state.time.getMinutes());

      this.setState({
        tz: changeTZ,
        time: changeTime.time,
        utcOffset: changeTime.utcOffset,
        isDST: changeTime.isDST
      });
      this.refs.datepicker.setDate(changeTime.time);
      this.refs.timepicker.setTime(changeTime.time, changeTime.utcOffset);
      var ndt = tzutil.shiftFromTz(changeTime.time, changeTZ);

      this.props.onChange(null, ndt);
    } else {
      var abbr = _.findWhere(this.props.tzAbbrs, {abbr: changeTZ});
      if (abbr) {
        console.log('Timecard::onChangeTZ() (abbr) - Hit! = ' + changeTZ + ' <- ' + this.state.tz);
        console.log('Timecard::onChangeTZ() (abbr) - ' + this.state.time + ' / ' + this.state.utcOffset);

        var ndt2 = tzutil.shiftFromTz(this.state.time, this.state.tz);
        var tzTime = tzutil.convertOffsetToOffset(this.state.time,
                                                  tzutil.canonicalizeJsDateOffseet(this.state.time.getTimezoneOffset()),
                                                  abbr.offsets[0].offset);

        this.setState({
          tz: changeTZ,
          utcOffset: abbr.offsets[0].offset
        });
        this.refs.timepicker.setOffset(abbr.offsets[0].offset);

        this.props.onChange(null, tzTime);
      }
    }
  },
  shiftToTzInfo: function(localTime, tz) {
    var info = _.findWhere(this.props.tzAbbrs, {abbr: tz});
    if (info) {
      info.time = tzutil.convertOffsetToOffset(localTime,
                                               tzutil.canonicalizeJsDateOffseet(localTime.getTimezoneOffset()),
                                               info.offsets[0].offset);
      info.utcOffset = info.offsets[0].offset;
      info.isDST = info.abbr.endsWith('DT');
    } else {
      info = tzutil.shiftToTzInfo(localTime, tz);
    }
    return info;
  },
  styles: {
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
  },
  formatDate: function(d) {
    var m = moment(d);
    return m.format('l (ddd)');
  },
  render: function() {
    var m = moment(this.state.time);
    var disabled = this.props.fromto === 'to';
    return (
      <Paper style={this.styles.card} zDepth={2}>
        <DatePicker ref="datepicker"
                    formatDate={this.formatDate}
                    defaultDate={this.state.time}
                    disabled={disabled}
                    onChange={this._onChangeDate} />
        <DualTimePicker ref="timepicker"
                        initialTime={this.state.time}
                        initialUtcOffset={this.state.utcOffset}
                        lang={this.props.lang}
                        disabled={disabled}
                        onChange={this._onChangeTime} />
        <div style={this.styles.tzwrapper}>
          <TextField ref="tzfield"
                     style={this.styles.timezone}
                     defaultValue={this.props.initialTz}
                     onChange={this._onChangeTZ} />
          <div style={this.styles.dst}>
            { this.state.isDST ? '夏時間' : '' }
          </div>
        </div>
      </Paper>
    );
  }
});

module.exports = TimeCard;
