import { Checkbox as AntCheckbox } from 'antd';
import React, { Component } from 'react';
const { Group: CheckboxGroup } = AntCheckbox

class Checkbox extends Component {
  render() {
    const { text, ...props } = this.props;
    return <AntCheckbox { ...props }>{text}</AntCheckbox>
  }
}
Checkbox.valuePropName = 'checked';

class Group extends Component {
  render() {
    const props = { ...this.props };
    return <CheckboxGroup { ...props } />
  }
}

Checkbox.Group = Group;

export default Checkbox;
