import React from 'react';
import { DatePicker as AntDatePicker } from 'antd';
import BaseWidget from './BaseWidget';

class DatePicker extends BaseWidget {
  render() {
    const { style, ...pickerProps } = this.widgetProps();
    const widgetProps = {
      style: {
        width: '100%',
        ...style,
      },
      ...pickerProps,
    };
    return <AntDatePicker {...widgetProps} />;
  }
}

export default DatePicker;
