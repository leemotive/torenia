import { Switch as AntSwitch } from 'antd';
import React, { Component } from 'react';

class Switch extends Component {
  render() {
    const { text, ...props } = this.props;
    return (
      <AntSwitch {...props}>{text}</AntSwitch>
    )
  }
}

Switch.valuePropName = 'checked';

export default Switch;
