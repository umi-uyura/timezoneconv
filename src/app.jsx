'use strict';

var React = require("react");
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

var _ = require('underscore');
var moment = require('moment-timezone');
require('moment/min/locales');
var tzDetect = require('jstimezonedetect');
var tzAbbr = require('../lib/timezone-abbrs');

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
var tzAbbrs = _.filter(tzAbbr.abbrs().list, function(item) {
  return (1 === item.offsets.length && 'UTC' !== item.abbr);
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
      basetime: new Date(),         // ローカルタイムに変換した基準時刻
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
    console.log('_onChangeFrom: ' + e + ' / ' + v.time + ' / ' + v.tz);
    this.setState({ basetime: v.time, tz1: v.tz});
  },
  _onChangeTo: function(e, v) {
    console.log('_onChangeTo: ' + e + ' / ' + v.time + ' / ' + v.tz);
    this.setState({ basetime: v.time, tz2: v.tz});
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
    console.log('App::render()');
    return (
      <div>
        <AppBar title="TimezoneConv" showMenuIconButton={false} />
        <Paper style={this.styles.card} zDepth={1}>
          <TimeCard ref="timecardFrom"
                    fromto="from"
                    lang={lang}
                    tz={this.state.tz1}
                    basetime={this.state.basetime}
                    tzItems={tzItems}
                    tzAbbrs={tzAbbrs}
                    onChange={this._onChangeFrom} />
          <div style={this.styles.toggle_wrap}>
            <Toggle ref="toggleTimeformat"
                    label="24時間表示"
                    defaultToggled={true}
                    onToggle={this._onToggle} />
          </div>
          <TimeCard ref="timecardTo"
                    fromto="to"
                    lang={lang}
                    tz={this.state.tz2}
                    basetime={this.state.basetime}
                    tzItems={tzItems}
                    tzAbbrs={tzAbbrs}
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
