import React from 'react';
import { Switch as AntSwitch } from 'antd';
import BaseWidget from './BaseWidget';

class Switch extends BaseWidget {
  valuePropName = 'checked';
  render() {
    const { text, ...widgetProps } = this.widgetProps();
    return <AntSwitch {...widgetProps}>{text}</AntSwitch>;
  }
}

export default Switch;
