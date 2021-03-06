'use strict';

var React = require('react');
var mui = require('material-ui');
var moment = require('moment-timezone');
require('moment/min/locales');
var _ = require('underscore');
var tzUtil = require('../lib/timezone-util');

var Paper = mui.Paper;
var Card = mui.Card;
var CardText = mui.CardText;
var TextField = mui.TextField;
var DatePicker = mui.DatePicker;
var DualTimePicker = require('./dualtimepicker.jsx');
var TimeCardText = require('./timecardtext.jsx');
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
  contextTypes: {
    muiTheme: React.PropTypes.object
  },
  componentWillMount: function() {
    moment.locale(this.props.lang);
  },
  setTimeFormat: function(format) {
    this.refs.timepicker.setState({ format24hr: (format === '24hr') });
  },
  _onChangeDate: function(e, v) {
    console.log('TimeCard::_onChangeDate() - ' + this.props.basetime + ' / ' + this.props.tz);
    console.log('TimeCard::_onChangeDate() input - ' + e + ' / ' + v);

    var t = this.refs.timepicker.getTime();
    t.setFullYear(v.getFullYear());
    t.setMonth(v.getMonth());
    t.setDate(v.getDate());

    console.log('TimeCard::_onChangeDate() merge - ' + t);

    var ndt = this.shiftFromTz(t, this.props.tz);

    console.log('TimeCard::_onChangeDate() ndt - ' + ndt);

    this.props.onChange(e, {
      time: ndt,
      tz: this.props.tz
    });
  },
  _onChangeTime: function(e, v) {
    console.log('TimeCard::_onChangeTime() - ' + this.props.basetime + ' / ' + this.props.tz);
    console.log('TimeCard::_onChangeTime() input - ' + e + ' / ' + v);
    var t = this.props.basetime;
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
    var changeTZUpcase = changeTZ.toUpperCase();

    var foundTzItems = _.contains(this.props.tzItems, changeTZ);
    var foundTzAbbrs = _.find(this.props.tzAbbrs, {abbr: changeTZUpcase});

    var disabled = this.props.fromto === 'to';

    if (foundTzItems || foundTzAbbrs) {
      console.log('Timecard::onChangeTZ() - Hit! = ' + changeTZ + ' <- ' + this.props.tz);
      console.log('Timecard::onChangeTZ() - Base Time = ' + this.props.basetime);

      var toTz = foundTzAbbrs ? changeTZUpcase : changeTZ;
      var ndt = this.props.basetime;

      if (!disabled) {
        var d = this.refs.datepicker.getDate();
        var t = this.refs.timepicker.getTime();
        var dt = new Date(d.getFullYear(), d.getMonth(), d.getDate(), t.getHours(), t.getMinutes());
        console.log('TimeCard::onChangeTZ() - Date = ' + d + '\n/ Time = ' + t + '\n/ ' + dt);

        ndt = this.shiftFromTz(dt, toTz);
      }

      console.log('TimeCard::onChangeTZ() - ndt = ' + ndt);

      this.props.onChange(null, {
        time: ndt,
        tz: toTz
      });
    } else {
      this.refs.tzfield.setErrorText('Unkown Timezone');
    }
  },
  shiftToTzInfo: function(localTime, tz) {
    var info = _.findWhere(this.props.tzAbbrs, {abbr: tz});
    if (info) {
      info.time = tzUtil.convertOffsetToOffset(localTime,
                                               info.offsets[0].offset,
                                               tzUtil.canonicalizeJsDateOffseet(localTime.getTimezoneOffset()));
      info.utcOffset = info.offsets[0].offset;
      info.isDST = false;    // TODO: 略名時の夏時間判定（→別データを用意するしか無い）
    } else {
      info = tzUtil.shiftToTzInfo(localTime, tz);
    }
    return info;
  },
  shiftFromTz: function(time, tz) {
    var info = _.findWhere(this.props.tzAbbrs, {abbr: tz});
    if (info) {
      var ndt = tzUtil.convertOffsetToOffset(time,
                                             tzUtil.canonicalizeJsDateOffseet(time.getTimezoneOffset()),
                                             info.offsets[0].offset);
      return ndt;
    } else {
      var ndt2 = tzUtil.shiftFromTz(time, tz);
      return ndt2;
    }
  },
  formatDate: function(d) {
    var m = moment(d);
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
      },
      resultWrapper: {
        width: '256px',
        margin: '0 auto',
        paddingTop: '12px'
      },
      cardToResult: {
        height: '36px',
        padding: '0px 0px',
        fontSize: '18px',
        textAlign: 'left',
        color: this.context.muiTheme.palette.accent1Color
      }
    };

    console.log('TimeCard::render() ' + this.props.fromto + ' / ' + this.props.basetime);

    var disabled = this.props.fromto === 'to';
    /* var disabled = false; */

    var info = this.shiftToTzInfo(this.props.basetime, this.props.tz);
    console.log('TimeCard::render() - shifted ' + this.props.fromto + ' / ' + info.time + ' / ' + info.utcOffset + ' / ' + info.isDST + ' / ' + this.props.tz);

    var picker = (
      <div>
        <DatePicker ref="datepicker"
                    formatDate={this.formatDate}
                    defaultDate={info.time}
                    value={info.time}
                    autoOk={true}
                    disabled={disabled}
                    onChange={this._onChangeDate} />
        <DualTimePicker ref="timepicker"
                        time={info.time}
                        utcOffset={info.utcOffset}
                        lang={this.props.lang}
                        disabled={disabled}
                        onChange={this._onChangeTime} />
      </div>
    );

    var text = (
      <div>
        <div style={styles.resultWrapper}>
          <CardText ref="datepicker" style={styles.cardToResult}>
            {this.formatDate(info.time)}
          </CardText>
        </div>
        <TimeCardText ref="timepicker"
                      time={info.time}
                      utcOffset={info.utcOffset} />
      </div>
    );

    return (
      <Card style={styles.card} zDepth={2}>
        <div style={styles.tzwrapper}>
          <TextField ref="tzfield"
                     style={styles.timezone}
                     defaultValue={this.props.tz}
                     onChange={this._onChangeTZ} />
          <div style={styles.dst}>
            {info.isDST ? '夏時間' : ''}
          </div>
        </div>
        {disabled ? text : picker}
      </Card>
    );
  }
});

module.exports = TimeCard;
