'use strict';

var React = require('react');
var mui = require('material-ui');

var DatePicker = mui.DatePicker;
var TimePicker = mui.TimePicker;

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

module.exports = DualTimePicker;
