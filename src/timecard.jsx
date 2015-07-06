'use strict';

var React = require('react');
var mui = require('material-ui');
var moment = require('moment-timezone');
require('moment/min/locales');

var Paper = mui.Paper;
var TextField = mui.TextField;
var DatePicker = mui.DatePicker;
var DualTimePicker = require('./dualtimepicker.jsx');
var DropDownMenu = mui.DropDownMenu;

var TimeCard = React.createClass({
  getDefaultProps: function() {
    return {
      fromto: 'from',
      initialTime: new Date(),
      lang: 'en',
      initial_tz: 'UTC',
      tz_items: []
    };
  },
  propTypes: {
    fromto: React.PropTypes.string.isRequired,
    initialTime: React.PropTypes.object,
    lang: React.PropTypes.string,
    initial_tz: React.PropTypes.string,
    tz_items: React.PropTypes.array,
    onChange: React.PropTypes.func.isRequired
  },
  getInitialState: function() {
    var dispTime = this.calcDispTime(this.props.initialTime, this.props.initial_tz);

    return {
      time: dispTime,
      tz: this.props.initial_tz
    };
  },
  componentWillMount: function() {
    moment.locale(this.props.lang);
  },
  calcDispTime: function(t, tz) {
    var tzTime = moment.tz(t, tz);
    var baseOffset = t.getTimezoneOffset();
    var localOffset = tzTime.utcOffset() + baseOffset;
    var dispTime = new Date(t.getTime() + (localOffset * 60 * 1000));
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
    var normalizeTime = new Date(dt.getTime() - (baseOffset * 60 * 1000));
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
    var t = this.state.time;
    t.setHours(v.getHours());
    t.setMinutes(v.getMinutes());

    this.setState({time: t});

    var ndt = this.normalizeDateTime(t);

    this.props.onChange(e, ndt);
  },
  _onChangeTZ: function(e, v) {
    console.log('Timecard::onChangeTZ() - ' + e + ' / ' + v);
    this.props.onChange(e, v);
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
                   defaultValue={this.props.initial_tz}
                   onChange={this._onChangeTZ} />
      </Paper>
    );
    /* <DropDownMenu menuItems={this.props.tz_items} /> */
  }
});

module.exports = TimeCard;
