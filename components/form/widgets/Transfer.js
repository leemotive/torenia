import { Transfer as AntTransfer } from 'antd';
import React, { Component } from 'react';

class Transfer extends Component {
  render() {
    const { ...props } = this.props;
    return <AntTransfer showSearch {...props} />;
  }
}

Transfer.valuePropName = 'targetKeys';

export default Transfer;
