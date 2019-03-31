import React from 'react';
import { TimePicker as AntTimePicker } from 'antd';
import BaseWidget from './BaseWidget';

class TimePicker extends BaseWidget {
  render() {
    const { style, ...pickerProps } = this.widgetProps();
    const widgetProps = {
      style: {
        width: '100%',
        ...style,
      },
      ...pickerProps,
    };

    return <AntTimePicker {...widgetProps} />;
  }
}

export default TimePicker;
