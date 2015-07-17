'use strict';

var React = require("react");
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

var _ = require('underscore');
var moment = require('moment-timezone');
require('moment/min/locales');
var tzDetect = require('jstimezonedetect');
var tzAbbrs = require('../lib/timezone-abbr');

var mui = require("material-ui");
var ThemeManager = new mui.Styles.ThemeManager();
var Paper = mui.Paper;
var Toggle = mui.Toggle;
var TimeCard = require('./timecard.jsx');
var AppBar = mui.AppBar;

var lang = browserLanguage();
console.log('Browser launguage: ' + lang);

moment.locale(lang ? lang : 'en');
console.log('Moment.js: ' + moment.locale());

var tz = tzDetect.jstz.determine();
console.log('Timezone detect: ' + tz.name());

var tzName = tz.name();
if (!_.contains(moment.tz.names(), tzName)) {
  tzName = 'UTC';
}

var tzItems = moment.tz.names();

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
      basetime: new Date(),
      tz1: tzName,
      tz2: 'UTC'
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
      padding: '8px',
      margin: '0 auto'
    },
    toggle_wrap: {
      textAlign: 'right'
    }
  },
  render: function() {
    return (
      <div>
        <AppBar title="TimezoneConv" showMenuIconButton={false} />
        <Paper style={this.styles.card} zDepth={1}>
          <TimeCard ref="timecardFrom"
                    lang={lang}
                    initialTz={this.state.tz1}
                    initialTime={this.state.basetime}
                    tzItems={tzItems}
                    onChange={this._onChangeFrom} />
          <div style={this.styles.toggle_wrap}>
            <Toggle ref="toggleTimeformat"
                    label="24時間表示"
                    defaultToggled={true}
                    onToggle={this._onToggle} />
          </div>
          <TimeCard ref="timecardTo"
                    lang={lang}
                    initialTz="UTC"
                    initialTime={this.state.basetime}
                    tzItems={tzItems}
                    onChange={this._onChangeTo} />
        </Paper>
      </div>
    );
  }
});

React.render(
  <App />,
  document.getElementById('app')
);
