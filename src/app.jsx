'use strict';

var React = require("react");
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

var _ = require('underscore');
var moment = require('moment-timezone');
require('moment/min/locales');
var tzdetect = require('jstimezonedetect');

var mui = require("material-ui");
var ThemeManager = new mui.Styles.ThemeManager();
var Paper = mui.Paper;
var Toggle = mui.Toggle;
var TimeCard = require('./timecard.jsx');

var lang = browserLanguage();
console.log('Browser launguage: ' + lang);

moment.locale(lang ? lang : 'en');
console.log('Moment.js: ' + moment.locale());

var tz = tzdetect.jstz.determine();
console.log('Timezone detect: ' + tz.name());

/* var tzv = moment.tz('America/Toronto');
   console.log('tzv');
   console.log(tzv);
   console.log(tzv.format()); */

// TODO: tzの検証、存在しない場合はUTCにする

/* console.log(moment.tz._names); */

var tzitems = _.map(moment.tz.names(), function(v) {
  return { payload: v, text: v };
});


function browserLanguage() {
  try {
    return (navigator.browserLanguage || navigator.language || navigator.userLanguage);
  }
  catch(e) {
    return undefined;
  }
}

var App = React.createClass({
  getInitialState: function() {
    return {
      fromTime: new Date(),
      toTime: new Date()
    };
  },
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },
  getChildContext: function() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },
  _onChangeFrom: function(e, v) {
    console.log('_onChangeFrom: ' + e + ' / ' + v);
    this.refs.timecardTo.setDateTime(v);
  },
  _onChangeTo: function(e, v) {
    console.log('_onChangeTo: ' + e + ' / ' + v);
    this.refs.timecardFrom.setDateTime(v);
  },
  _onToggle: function(e, toggled) {
    this.refs.timecardFrom.setTimeFormat(toggled ? '24hr' : 'ampm');
    this.refs.timecardTo.setTimeFormat(toggled ? '24hr' : 'ampm');
  },
  styles: {
    card: {
      padding: '12px'
    },
    toggle_wrap: {
      textAlign: 'right'
    }
  },
  render: function() {
    return (
      <Paper style={this.styles.card} zDepth={1}>
        <TimeCard ref="timecardFrom"
                  lang={lang}
                  initial_tz={tz.name()}
                  onChange={this._onChangeFrom} />
        <div style={this.styles.toggle_wrap}>
          <Toggle ref="toggleTimeformat"
                  label="24時間表示"
                  defaultToggled={true}
                  onToggle={this._onToggle} />
        </div>
        <TimeCard ref="timecardTo"
                  lang={lang}
                  initial_tz="UTC"
                  onChange={this._onChangeTo} />
      </Paper>
    );
  }
});

React.render(
  <App />,
  document.getElementById('app')
);
