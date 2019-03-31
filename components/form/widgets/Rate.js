import React from 'react';
import { Rate as AntRate } from 'antd';
import BaseWidget from './BaseWidget';

class Rate extends BaseWidget {
  render() {
    const widgetProps = this.widgetProps();
    return <AntRate {...widgetProps} />;
  }
}

export default Rate;
