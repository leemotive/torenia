import React from 'react';
import { Input as AntInput } from 'antd';
import BaseWidget from './BaseWidget';

class Password extends BaseWidget {
  render() {
    const widgetProps = {
      ...this.widgetProps(),
      type: 'password',
    };
    return <AntInput {...widgetProps} />;
  }
}

export default Password;
