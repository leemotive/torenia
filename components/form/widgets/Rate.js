import React, { Component } from 'react';
import { Rate as AntRate } from 'antd';

class Rate extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { ...props } = this.props;
    return <AntRate { ...props } />;
  }
}

export default Rate;
