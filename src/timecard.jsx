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
var DualTimePicker = require('./dualtimepicker.jsx');
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
  setTimeFormat: function(format) {
    this.refs.timepicker.setState({ format24hr: (format === '24hr') });
  },
  _onChange: function() {
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
        <TextField style={this.styles.textfield}
                   disabled={disabled}
                   defaultValue={tz.name()} />
      </Paper>
    );
  }
});

module.exports = TimeCard;
