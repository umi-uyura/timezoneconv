'use strict';

var React = require('react');
var mui = require('material-ui');
var moment = require('moment');
require('moment/min/locales');
//var mtz = require('moment-timezone');
var tzdetect = require('jstimezonedetect');

var Paper = mui.Paper;
var TextField = mui.TextField;
var DatePicker = mui.DatePicker;
var TimePicker = mui.TimePicker;
var Toggle = mui.Toggle;

var tz = tzdetect.jstz.determine();
var lang = browserLanguage();

console.log('Moment.js: ' + moment.locale());
console.log('Timezone detect: ' + tz.name());
console.log('Browser launguage: ' + lang);

moment.locale(lang ? lang : 'en');

function browserLanguage() {
  try {
    return (navigator.browserLanguage || navigator.language || navigator.userLanguage);
  }
  catch(e) {
    return undefined;
  }
}

var DualTimePicker = React.createClass({
  getInitialState: function() {
    return {
      format24hr: true,
      time: new Date()
    };
  },
  _onChange: function(e, t) {
    this.setState({time: t});
    this.refs.picker24HR.setTime(t);
    this.refs.pickerAMPM.setTime(t);
  },
  render: function() {
    var format = this.state.format24hr ? '24hr' : 'ampm';
    var styleVisible = {};
    var styleHide = { display: 'none' };

    return (
      <div>
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
      </div>
    );
  }
});

var TimeCard = React.createClass({
  getDefaultProps: function() {
    return {
      fromto: 'from',
      value: new Date()
    };
  },
  propTypes: {
    fromto: React.PropTypes.string.isRequired,
    value: React.PropTypes.object,
    onChange: React.PropTypes.func.isRequired
  },
  _onChange: function() {
  },
  _onToggle: function(e, toggled) {
    this.refs.timepicker.setState({ format24hr: toggled });
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
    var m = moment(this.props.value);
    var disabled = this.props.fromto === 'to';
    return (
      <Paper style={this.styles.card} zDepth={2}>
        <DatePicker formatDate={this.formatDate} defaultDate={this.props.value} />
        <DualTimePicker ref="timepicker" disabled={disabled} />
        <Toggle ref="toggleTimeformat"
                label="24時間表記"
                defaultToggled={true}
                disabled={disabled}
                onToggle={this._onToggle} />
        <TextField style={this.styles.textfield}
                   disabled={disabled}
                   defaultValue={tz.name()} />
      </Paper>
    );
  }
});

module.exports = TimeCard;
