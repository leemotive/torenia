import React from 'react';
import { Input as AntInput } from 'antd';
import BaseWidget from './BaseWidget';

const { TextArea: AntTextArea } = AntInput;

class Input extends BaseWidget {
  render() {
    const widgetProps = this.widgetProps();
    return <AntInput {...widgetProps} />;
  }
}

class TextArea extends BaseWidget {
  render() {
    const { autosize, ...areaProps } = this.widgetProps();
    const widgetProps = {
      autosize: {
        minRows: 3,
        maxRows: 9,
        ...autosize,
      },
      ...areaProps,
    };
    return <AntTextArea {...widgetProps} />;
  }
}

export default Input;
export { TextArea };
