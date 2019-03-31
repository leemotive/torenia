import React from 'react';
import { Transfer as AntTransfer } from 'antd';
import BaseWidget from './BaseWidget';

class Transfer extends BaseWidget {
  valuePropName = 'targetKeys';
  render() {
    const widgetProps = {
      showSearch: true,
      ...this.widgetProps(),
    };
    return <AntTransfer {...widgetProps} />;
  }
}

export default Transfer;
