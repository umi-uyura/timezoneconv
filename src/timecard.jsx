'use strict';

var React = require('react');
var mui = require('material-ui');
var moment = require('moment-timezone');
require('moment/min/locales');
var _ = require('underscore');
var tzutil = require('../lib/timezone-util');

var Paper = mui.Paper;
var TextField = mui.TextField;
var DatePicker = mui.DatePicker;
var DualTimePicker = require('./dualtimepicker.jsx');
var Colors = mui.Styles.Colors;

var util = require('util');

var TimeCard = React.createClass({
  getDefaultProps: function() {
    return {
      fromto: 'from',
      basetime: new Date(),
      tz: 'UTC',
      lang: 'en',
      tzItems: [],
      tzAbbrs: []
    };
  },
  propTypes: {
    fromto: React.PropTypes.string.isRequired,
    basetime: React.PropTypes.object.isRequired,
    tz: React.PropTypes.string.isRequired,
    lang: React.PropTypes.string,
    tzItems: React.PropTypes.array,
    tzAbbrs: React.PropTypes.array,
    onChange: React.PropTypes.func.isRequired
  },
  getInitialState: function() {
    return {
      time: new Date(),       // ローカル時刻をタイムゾーンに合わせてシフトした日時
      utcOffset: 0,
      isDst: false
    };
  },
  componentWillMount: function() {
    moment.locale(this.props.lang);
    var info = this.shiftToTzInfo(this.props.basetime, this.props.tz);
    this.setState({
      time: info.time,
      utcOffset: info.utcOffset,
      isDst: info.isDst
    });
  },
  componentWillReceiveProps: function(nextProps) {
    /* console.log('TimeCard::componentWillReceiveProps() - ' + util.inspect(nextProps)); */
    /* console.log('TimeCard::componentWillReceiveProps() - ' + this.props.fromto + ' / ' + nextProps.basetime + ' / ' + nextProps.tz); */
    var info = this.shiftToTzInfo(nextProps.basetime, nextProps.tz);
    /* console.log('TimeCard::componentWillReceiveProps() - ' + this.props.fromto + ' / ' + info.time + ' / ' + nextProps.tz); */
    this.setState({
      time: info.time,
      utcOffset: info.utcOffset,
      isDst: info.isDst
    });
  },
  setTimeFormat: function(format) {
    this.refs.timepicker.setState({ format24hr: (format === '24hr') });
  },
  _onChangeDate: function(e, v) {
    var t = this.state.time;
    t.setFullYear(v.getFullYear());
    t.setMonth(v.getMonth());
    t.setDate(v.getDate());

    var ndt = this.shiftFromTz(t, this.props.tz);

    this.props.onChange(e, {
      time: ndt,
      tz: this.props.tz
    });
  },
  _onChangeTime: function(e, v) {
    console.log('TimeCard::_onChangeTime() - ' + this.state.time + ' / ' + this.props.tz);
    console.log('TimeCard::_onChangeTime() input - ' + e + ' / ' + v);
    var t = this.state.time;
    t.setHours(v.getHours());
    t.setMinutes(v.getMinutes());

    var ndt = this.shiftFromTz(t, this.props.tz);

    this.props.onChange(e, {
      time: ndt,
      tz: this.props.tz
    });
  },
  _onChangeTZ: function(v) {
    var changeTZ = v.target.value;
    if (_.contains(this.props.tzItems, changeTZ)) {
      console.log('Timecard::onChangeTZ() - Hit! = ' + changeTZ + ' <- ' + this.props.tz);

      var changeTime = tzutil.convertTZtoTZInfo(this.state.time, this.props.tz, changeTZ);
      console.log('Timecard::onChangeTZ() - changeTime = ' + changeTime.time + ' / ' + changeTime.utcOffset + ' / ' + changeTime.isDST);

      changeTime.time.setFullYear(this.state.time.getFullYear());
      changeTime.time.setMonth(this.state.time.getMonth());
      changeTime.time.setDate(this.state.time.getDate());
      changeTime.time.setHours(this.state.time.getHours());
      changeTime.time.setMinutes(this.state.time.getMinutes());

      this.setState({
        tz: changeTZ,
        time: changeTime.time,
        utcOffset: changeTime.utcOffset,
        isDST: changeTime.isDST
      });

      console.log('TimeCard::_onChangeTZ() -> DatePicker::setDate() - ' + this.props.fromto + ' / ' + changeTime.time);
      this.refs.datepicker.setDate(changeTime.time);
      this.refs.timepicker.setTime(changeTime.time, changeTime.utcOffset);
      var ndt = this.shiftFromTz(changeTime.time, changeTZ);

      this.props.onChange(null, ndt);
    } else {
      var abbr = _.findWhere(this.props.tzAbbrs, {abbr: changeTZ});
      if (abbr) {
        console.log('Timecard::onChangeTZ() (abbr) - Hit! = ' + changeTZ + ' <- ' + this.props.tz);
        console.log('Timecard::onChangeTZ() (abbr) - ' + this.state.time + ' / ' + this.state.utcOffset);

        var ndt2 = this.shiftFromTz(this.state.time, this.props.tz);
        var tzTime = tzutil.convertOffsetToOffset(this.state.time,
                                                  tzutil.canonicalizeJsDateOffseet(this.state.time.getTimezoneOffset()),
                                                  abbr.offsets[0].offset);

        console.log('Timecard::onChangeTZ() (abbr) - ' + ndt2 + ' / ' + tzTime);

        this.setState({
          tz: changeTZ,
          utcOffset: abbr.offsets[0].offset
        });

        this.refs.timepicker.setOffset(abbr.offsets[0].offset);

        this.props.onChange(null, tzTime);
      }
    }
  },
  shiftToTzInfo: function(localTime, tz) {
    var info = _.findWhere(this.props.tzAbbrs, {abbr: tz});
    if (info) {
      info.time = tzutil.convertOffsetToOffset(localTime,
                                               tzutil.canonicalizeJsDateOffseet(localTime.getTimezoneOffset()),
                                               info.offsets[0].offset);
      info.utcOffset = info.offsets[0].offset;
      info.isDST = false;    // TODO: 略名時の夏時間判定（→別データを用意するしか無い）
    } else {
      info = tzutil.shiftToTzInfo(localTime, tz);
    }
    return info;
  },
  shiftFromTz: function(time, tz) {
    var info = _.findWhere(this.props.tzAbbrs, {abbr: tz});
    if (info) {
      var ndt = new Date(time.getTime() - (info.offsets[0].offset * 60 * 1000));
      return ndt;
    } else {
      var ndt2 = tzutil.shiftFromTz(time, tz);
      return ndt2;
    }
  },
  formatDate: function(d) {
    /* console.log('TimeCard::formatDate() - ' + this.props.fromto + ' before ' + d); */
    var m = moment(d);
    /* console.log('TimeCard::formatDate() - ' + this.props.fromto + ' after  ' + m.format('l (ddd)')); */
    return m.format('l (ddd)');
  },
  render: function() {
    var styles = {
      card: {
        margin: '8px',
        padding: '8px',
        textAlign: 'center'
      },
      tzwrapper: {
        position: 'relative',
        width: '256px',
        margin: '0 auto'
      },
      timezone: {
        display: 'block',
        margin: '0 auto'
      },
      dst: {
        position: 'absolute',
        top: '16px',
        right: '0px',
        padding: '0 4px',
        fontSize: 'small',
        color: Colors.grey400,
        backgroundColor: 'white'
      }
    };

    console.log('TimeCard::render() ' + this.props.fromto);
    /* var disabled = this.props.fromto === 'to'; */
    var disabled = false;
    return (
      <Paper style={styles.card} zDepth={2}>
        <DatePicker ref="datepicker"
                    formatDate={this.formatDate}
                    defaultDate={this.state.time}
                    autoOk={true}
                    disabled={disabled}
                    onChange={this._onChangeDate} />
        <DualTimePicker ref="timepicker"
                        initialTime={this.state.time}
                        initialUtcOffset={this.state.utcOffset}
                        lang={this.props.lang}
                        disabled={disabled}
                        onChange={this._onChangeTime} />
        <div style={styles.tzwrapper}>
          <TextField ref="tzfield"
                     style={styles.timezone}
                     defaultValue={this.props.tz}
                     onChange={this._onChangeTZ} />
          <div style={styles.dst}>
            { this.state.isDST ? '夏時間' : '' }
          </div>
        </div>
      </Paper>
    );
  }
});

module.exports = TimeCard;
