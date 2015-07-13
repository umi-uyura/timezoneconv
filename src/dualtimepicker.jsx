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
      lang: 'en'
    };
  },
  getInitialState: function() {
    return {
      format24hr: true,
      time: this.props.initialTime
    };
  },
  componentWillMount: function() {
    moment.locale(this.props.lang);
  },
  _onChange: function(e, t) {
    this.setTime(t);
    this.props.onChange(e, t);
  },
  getTime: function() {
    return this.state.time;
  },
  setTime: function(t) {
    this.refs.picker24HR.setTime(t);
    this.refs.pickerAMPM.setTime(t);
    this.setState({time: t});
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
                    defaultTime={this.state.time} />
        <TimePicker ref="pickerAMPM"
                    style={this.state.format24hr ? styleHide : styleVisible }
                    format="ampm"
                    disabled={this.props.disabled}
                    onChange={this._onChange}
                    defaultTime={this.state.time} />
        <div style={this.styles.offset}>
          UTC +99:00
        </div>
      </div>
    );
  }
});

module.exports = DualTimePicker;
