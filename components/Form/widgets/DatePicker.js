import { DatePicker as AntDatePicker } from 'antd';
import React, { Component } from 'react';
import Moment from 'moment';

class DatePicker extends Component {
  render() {
    const { ...props } = this.props;
    props.style = { width: '100%', ...props.style };

    return <AntDatePicker { ...props } />
  }
}



DatePicker.transform = function(timestamp) {
  return Moment(timestamp);
}

export default DatePicker;
