import { Cascader as AntCascader } from 'antd';
import React, { Component } from 'react';
import city from './city';

class Cascader extends Component {
  render() {
    const { ...props } = this.props;
    props.style = { width: '100%', ...props.style };
    return <AntCascader {...props} />;
  }
}

class Address extends Component {
  render() {
    const { ...props } = this.props;
    props.options = props.options || city;
    props.style = { width: '100%', ...props.style };
    return <AntCascader {...props} />;
  }
}

Cascader.transform = Address.transform = function(value) {
  if (Array.isArray(value)) {
    return value;
  } else if (typeof value === 'string') {
    return value.split(' ');
  } else {
    return [];
  }
};

export default Cascader;
export { Address };
