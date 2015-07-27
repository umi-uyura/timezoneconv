'use strict';

var React = require('react');
var mui = require('material-ui');
var moment = require('moment-timezone');
require('moment/min/locales');

var DatePicker = mui.DatePicker;
var TimePicker = mui.TimePicker;
var Colors = mui.Styles.Colors;

var DualTimePicker = React.createClass({
  getDefaultProps: function() {
    return {
      initialTime: new Date(),
      initialUtcOffset: 0,
      lang: 'en'
    };
  },
  getInitialState: function() {
    return {
      format24hr: true
    };
  },
  componentWillMount: function() {
    moment.locale(this.props.lang);
  },
  componentWillReceiveProps: function(nextProps) {
    if (nextProps.initialTime !== this.props.initialTime) {
      this.refs.picker24HR.setTime(nextProps.initialTime);
      this.refs.pickerAMPM.setTime(nextProps.initialTime);
    }
  },
  getTime: function() {
    return this.props.initialTime;
  },
  _onChange: function(e, t) {
    this.props.onChange(e, t);
  },
  styles: {
    wrapper: {
      position: 'relative',
      width: '256px',
      margin: '0 auto'
    },
    offset: {
      position: 'absolute',
      top: '16px',
      right: '0px',
      fontSize: 'small',
      color: Colors.grey400
    }
  },
  formatUtcOffset: function(offset) {
    var hours = Math.floor(offset / 60);
    var minutes = (Math.abs(offset % 60) + '0').substr(0, 2);
    var sign = (0 <= hours) ? '+' : '';

    return 'UTC ' + sign + hours + ':' + minutes;
  },
  render: function() {
    var format = this.state.format24hr ? '24hr' : 'ampm';
    var styleVisible = {};
    var styleHide = { display: 'none' };

    return (
      <div style={this.styles.wrapper}>
        <TimePicker ref="picker24HR"
                    style={this.state.format24hr ? styleVisible : styleHide }
                    format="24hr"
                    disabled={this.props.disabled}
                    onChange={this._onChange}
                    defaultTime={this.props.initialTime} />
        <TimePicker ref="pickerAMPM"
                    style={this.state.format24hr ? styleHide : styleVisible }
                    format="ampm"
                    disabled={this.props.disabled}
                    onChange={this._onChange}
                    defaultTime={this.props.initialTime} />
        <div style={this.styles.offset}>
          {this.formatUtcOffset(this.props.initialUtcOffset)}
        </div>
      </div>
    );
  }
});

module.exports = DualTimePicker;
