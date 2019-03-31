import React from 'react';
import { Input as AntInput } from 'antd';
import BaseWidget from './BaseWidget';

class Hidden extends BaseWidget {
  render() {
    const widgetProps = this.widgetProps();
    return <AntInput {...widgetProps} />;
  }
}

export default Hidden;
