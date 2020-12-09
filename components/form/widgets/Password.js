import React, { Component } from 'react';
import { Input as AntInput } from 'antd';

class Password extends Component {
  render() {
    const props = { ...this.props, type: 'password' };
    return <AntInput.Password {...props} />;
  }
}

export default Password;
