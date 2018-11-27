import { Radio as AntRadio } from 'antd';
import React, { Component } from 'react';

const { Group: RadioGroup } = AntRadio;

class Radio extends Component {
  render() {
    const { text, ...props } = this.props;
    return <AntRadio {...props}>{text}</AntRadio>;
  }
}

class Group extends Component {
  render() {
    const props = { ...this.props };
    return <RadioGroup {...props} />;
  }
}

Radio.Group = Group;

export default Radio;
