import { Cascader as AntCascader } from 'antd';
import React from 'react';
import city from './city';
import BaseWidget from './BaseWidget';

class Cascader extends BaseWidget {
  render() {
    const { style, ...cascaderProps } = this.widgetProps();
    const widgetProps = {
      style: { width: '100%', ...style },
      ...cascaderProps,
    };
    return <AntCascader {...widgetProps} />;
  }
}

class Address extends BaseWidget {
  render() {
    const { options, style, ...addressProps } = this.widgetProps();

    const widgetProps = {
      options: options || city,
      style: { width: '100%', ...style },
      ...addressProps,
    };

    return <AntCascader {...widgetProps} />;
  }
}

export default Cascader;
export { Address };
