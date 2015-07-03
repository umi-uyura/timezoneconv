'use strict';

var React = require("react");
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

var mui = require("material-ui");
var ThemeManager = new mui.Styles.ThemeManager();
var Paper = mui.Paper;
var Toggle = mui.Toggle;
var TimeCard = require('./timecard.jsx');

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
  _onChangeFrom: function() {
  },
  _onChangeTo: function() {
  },
  _onToggle: function(e, toggled) {
    this.refs.timecardFrom.setTimeFormat(toggled ? '24hr' : 'ampm');
    this.refs.timecardTo.setTimeFormat(toggled ? '24hr' : 'ampm');
  },
  styles: {
    card: {
      padding: '12px'
    }
  },
  render: function() {
    return (
      <Paper style={this.styles.card} zDepth={1}>
        <TimeCard ref="timecardFrom" onChange={this._onChangeFrom} />
        <Toggle ref="toggleTimeformat"
                label="24時間表記"
                defaultToggled={true}
                onToggle={this._onToggle} />
        <TimeCard ref="timecardTo" fromto="to" onChange={this._onChangeTo} />
      </Paper>
    );
  }
});

React.render(
  <App />,
  document.body
);
