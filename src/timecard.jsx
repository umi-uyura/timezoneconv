'use strict';

var React = require('react');
var mui = require('material-ui');
var moment = require('moment-timezone');
require('moment/min/locales');
var _ = require('underscore');

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
    var dispTime = this.calcDispTime(this.props.initialTime, this.props.initialTz);

    return {
      time: dispTime,
      tz: this.props.initialTz
    };
  },
  componentWillMount: function() {
    moment.locale(this.props.lang);
  },
  calcDispTime: function(t, tz) {
    var tzTime = moment.tz(t, tz);
    var baseOffset = t.getTimezoneOffset();
    var localOffset = tzTime.utcOffset() + baseOffset;
    var calcTime = (tzTime.utcOffset() < localOffset) ?
                   t.getTime() - (localOffset * 60 * 1000) :
                   t.getTime() + (localOffset * 60 * 1000);
    var dispTime = new Date(calcTime);
    return dispTime;
  },
  setTimeFormat: function(format) {
    this.refs.timepicker.setState({ format24hr: (format === '24hr') });
  },
  setDateTime: function(dt) {
    var mm = this.calcDispTime(dt, this.state.tz);

    this.refs.datepicker.setDate(mm);
    this.refs.timepicker.setTime(mm);
  },
  normalizeDateTime: function(dt) {
    var tzTime = moment.tz(dt, this.state.tz);
    var baseOffset = dt.getTimezoneOffset() + tzTime.utcOffset();
    var calcTime = (tzTime.utcOffset() < dt.getTimezoneOffset()) ?
                   dt.getTime() - (baseOffset * 60 * 1000) :
                   dt.getTime() + (baseOffset * 60 * 1000);
    var normalizeTime = new Date(calcTime);
    return normalizeTime;
  },
  _onChangeDate: function(e, v) {
    var t = this.state.time;
    t.setFullYear(v.getFullYear());
    t.setMonth(v.getMonth());
    t.setDate(v.getDate());

    this.setState({time: t});

    var ndt = this.normalizeDateTime(t);

    this.props.onChange(e, ndt);
  },
  _onChangeTime: function(e, v) {
    console.log('TimeCard::_onChangeTime() - ' + e + ' / ' + v);
    var t = this.state.time;
    t.setHours(v.getHours());
    t.setMinutes(v.getMinutes());

    this.setState({time: t});

    var ndt = this.normalizeDateTime(t);
    console.log('TimeCard::_onChangeTime() - ' + ndt);

    this.props.onChange(e, ndt);
  },
  _onChangeTZ: function(v) {
    var changeTZ = v.target.value;
    if (_.contains(moment.tz.names(), changeTZ)) {
      console.log('Timecard::onChangeTZ() - Hit! = ' + changeTZ + ' <- ' + this.state.tz);

      var beforeTime = moment.tz(this.state.time, this.state.tz);
      console.log('Timecard::onChangeTZ() - before Time = ' + this.state.time);
      console.log('Timecard::onChangeTZ() - before = ' + beforeTime.zoneName());
      console.log('Timecard::onChangeTZ() - before = ' + beforeTime.format());
      console.log('Timecard::onChangeTZ() - before = ' + beforeTime.utcOffset());
      console.log('Timecard::onChangeTZ() - before = ' + beforeTime.toDate());
      var offset = beforeTime.utcOffset();

      var afterTime = beforeTime.tz(changeTZ);
      console.log('Timecard::onChangeTZ() - after = ' + afterTime.zoneName());
      console.log('Timecard::onChangeTZ() - after = ' + afterTime.format());
      console.log('Timecard::onChangeTZ() - after = ' + afterTime.utcOffset());
      console.log('Timecard::onChangeTZ() - after = ' + afterTime.toDate());

      var changeTime = null;
      if (offset < afterTime.utcOffset()) {
        changeTime = new Date(afterTime.toDate().getTime() + ((afterTime.utcOffset() - offset) * 60 * 1000));
      } else {
        changeTime = new Date(afterTime.toDate().getTime() - ((offset - afterTime.utcOffset()) * 60 * 1000));
      }

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
      display: 'block'
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
