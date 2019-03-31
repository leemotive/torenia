import React from 'react';
import { Checkbox as AntCheckbox } from 'antd';
import BaseWidget from './BaseWidget';
const { Group: CheckboxGroup } = AntCheckbox;

class Checkbox extends BaseWidget {
  valuePropName = 'checked';
  render() {
    const { text, ...widgetProps } = this.widgetProps();
    return <AntCheckbox {...widgetProps}>{text}</AntCheckbox>;
  }
}

class Group extends BaseWidget {
  render() {
    const widgetProps = this.widgetProps();
    return <CheckboxGroup {...widgetProps} />;
  }
}

Checkbox.Group = Group;

export default Checkbox;
