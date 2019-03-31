import React from 'react';
import { Select as AntSelect } from 'antd';
import BaseWidget from './BaseWidget';

const { Option } = AntSelect;

class Select extends BaseWidget {
  render() {
    const { options = [], ...widgetProps } = this.widgetProps();

    const children = options.map((option, index) => {
      if (React.isValidElement(option)) {
        return option;
      } else if (typeof option === 'string') {
        return (
          <Option value={option} key={index}>
            {option}
          </Option>
        );
      } else {
        return (
          <Option value={option.value} key={index}>
            {option.label}
          </Option>
        );
      }
    });

    return <AntSelect {...widgetProps}>{children}</AntSelect>;
  }
}

export default Select;
