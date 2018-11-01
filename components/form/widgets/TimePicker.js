import { TimePicker as AntTimePicker } from 'antd';
import React, { Component } from 'react';
import Moment from 'moment';

class TimePicker extends Component {
  render() {
    const { ...props } = this.props;
    props.style = { width: '100%', ...props.style };

    return <AntTimePicker { ...props } />
  }
}



TimePicker.transform = function(timestamp) {
  if (/\d{1,2}:\d{1,2}:\d{1,2}/.test(timestamp)) {
    return Moment(timestamp, 'HH:mm:ss');
  }
  return Moment(timestamp);
}

export default TimePicker;
