'use strict';

var React = require("react");
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

var mui = require("material-ui");
var ThemeManager = new mui.Styles.ThemeManager();
var Paper = mui.Paper;
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
  onChangeFrom: function() {
  },
  onChangeTo: function() {
  },
  styles: {
    card: {
      padding: '12px'
    }
  },
  render: function() {
    return (
      <Paper style={this.styles.card} zDepth={1}>
        <TimeCard onChange={this.onChangeFrom} />
        <TimeCard fromto="to" onChange={this.onChangeTo} />
      </Paper>
    );
  }
});

React.render(
  <App />,
  document.body
);
