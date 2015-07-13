'use strict';

var React = require('react');
var mui = require('material-ui');
var moment = require('moment-timezone');
require('moment/min/locales');
var _ = require('underscore');
var tzutil = require('../lib/timezoneutil');

var Paper = mui.Paper;
var TextField = mui.TextField;
var DatePicker = mui.DatePicker;
var DualTimePicker = require('./dualtimepicker.jsx');

var TimeCard = React.createClass({
  getDefaultProps: function() {
    return {
      fromto: 'from',
      initialTime: new Date(),
      lang: 'en',
      initialTz: 'UTC',
      tz_items: []
    };
  },
  propTypes: {
    fromto: React.PropTypes.string.isRequired,
    initialTime: React.PropTypes.object,
    lang: React.PropTypes.string,
    initialTz: React.PropTypes.string,
    tz_items: React.PropTypes.array,
    onChange: React.PropTypes.func.isRequired
  },
  getInitialState: function() {
    var dispTime = tzutil.shiftToTz(this.props.initialTime, this.props.initialTz);

    return {
      time: dispTime,
      tz: this.props.initialTz
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
    var mm = tzutil.shiftToTz(dt, this.state.tz);

    console.log('TimeCard::setDateTime() disp - ' + mm);

    this.setState({time: dt});

    this.refs.datepicker.setDate(mm);
    this.refs.timepicker.setTime(mm);
  },
  _onChangeDate: function(e, v) {
    var t = this.state.time;
    t.setFullYear(v.getFullYear());
    t.setMonth(v.getMonth());
    t.setDate(v.getDate());

    this.setState({time: t});

    var ndt = tzutil.shiftFromTz(t, this.state.tz);

    this.props.onChange(e, ndt);
  },
  _onChangeTime: function(e, v) {
    console.log('TimeCard::_onChangeTime() - ' + this.state.time + ' / ' + this.state.tz);
    console.log('TimeCard::_onChangeTime() input - ' + e + ' / ' + v);
    var t = this.state.time;
    t.setHours(v.getHours());
    t.setMinutes(v.getMinutes());

    this.setState({time: t});

    var ndt = tzutil.shiftFromTz(t, this.state.tz);
    console.log('TimeCard::_onChangeTime() shift - ' + ndt);

    this.props.onChange(e, ndt);
  },
  _onChangeTZ: function(v) {
    var changeTZ = v.target.value;
    if (_.contains(moment.tz.names(), changeTZ)) {
      console.log('Timecard::onChangeTZ() - Hit! = ' + changeTZ + ' <- ' + this.state.tz);

      var changeTime = tzutil.convertTZtoTZ(this.state.time, this.state.tz, changeTZ);
      console.log('Timecard::onChangeTZ() - changeTime = ' + changeTime);

      this.setState({
        tz: changeTZ,
        time: changeTime
      });
      this.refs.datepicker.setDate(changeTime);
      this.refs.timepicker.setTime(changeTime);
    }
  },
  styles: {
    card: {
      margin: '12px',
      padding: '12px',
      textAlign: 'center'
    },
    textfield: {
      display: 'block',
      margin: '0 auto'
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
                        lang={this.props.lang}
                        disabled={disabled}
                        onChange={this._onChangeTime} />
        <TextField ref="tzfield"
                   style={this.styles.textfield}
                   defaultValue={this.props.initialTz}
                   onChange={this._onChangeTZ} />
      </Paper>
    );
  }
});

module.exports = TimeCard;
