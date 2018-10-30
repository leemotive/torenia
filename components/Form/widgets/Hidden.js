import React, { Component } from 'react';
import { Input as AntInput } from 'antd';

class Hidden extends Component {
  render() {
    const props = { ...this.props, type: 'hidden' };
    return <AntInput {...props } />
  }
}

export default Hidden;
