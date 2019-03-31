import React from 'react';
import { Radio as AntRadio } from 'antd';
import BaseWidget from './BaseWidget';

const { Group: RadioGroup } = AntRadio;

class Radio extends BaseWidget {
  valuePropName = 'checked';
  render() {
    const { text, ...widgetProps } = this.widgetProps();
    return <AntRadio {...widgetProps}>{text}</AntRadio>;
  }
}

class Group extends BaseWidget {
  render() {
    const widgetProps = this.widgetProps();
    return <RadioGroup {...widgetProps} />;
  }
}

Radio.Group = Group;

export default Radio;
