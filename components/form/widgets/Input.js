import { Input as AntInput } from 'antd';
import React, { Component } from 'react';

const { TextArea: AntTextArea } = AntInput;

class Input extends Component {
  render() {
    const props = { ...this.props };
    return <AntInput {...props} />;
  }
}

class TextArea extends Component {
  render() {
    const props = { autosize: { minRows: 3, maxRows: 9 }, ...this.props };
    return <AntTextArea {...props} />;
  }
}

export default Input;
export { TextArea };
