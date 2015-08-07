'use strict';

var React = require('react');
var mui = require('material-ui');
var moment = require('moment-timezone');
/* require('moment/min/locales'); */

var TimePicker = mui.TimePicker;
var CardText = mui.CardText;
var Colors = mui.Styles.Colors;

var TimeCardText = React.createClass({
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
  contextTypes: {
    muiTheme: React.PropTypes.object
  },
  formatUtcOffset: function(offset) {
    var hours = Math.floor(offset / 60);
    var minutes = (Math.abs(offset % 60) + '0').substr(0, 2);
    var sign = (0 <= hours) ? '+' : '';

    return 'UTC ' + sign + hours + ':' + minutes;
  },
  render: function() {
    var styles = {
      wrapper: {
        position: 'relative',
        width: '256px',
        margin: '0 auto',
        paddingTop: '12px'
      },
      offset: {
        position: 'absolute',
        top: '16px',
        right: '0px',
        fontSize: 'small',
        color: Colors.grey400
      },
      cardToResult: {
        height: '36px',
        padding: '0px 0px',
        fontSize: '18px',
        textAlign: 'left',
        color: this.context.muiTheme.palette.accent1Color
      }
    };

    var format = this.state.format24hr ? '24hr' : 'ampm';
    var time = this.state.format24hr ? moment(this.props.initialTime).format('HH:mm') : moment(this.props.initialTime).locale('en').format('hh:mm a');

    return (
      <div style={styles.wrapper}>
        <CardText ref="timepicker" style={styles.cardToResult}>
          {time}
        </CardText>
        <div style={styles.offset}>
          {this.formatUtcOffset(this.props.initialUtcOffset)}
        </div>
      </div>
    );
  }
});

module.exports = TimeCardText;
