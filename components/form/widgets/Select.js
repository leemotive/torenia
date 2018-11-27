import React, { Component } from 'react';
import { Select as AntSelect } from 'antd';

const { Option } = AntSelect;

class Select extends Component {
  render() {
    const { options = [], ...others } = this.props;

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

    return <AntSelect {...others}>{children}</AntSelect>;
  }
}

export default Select;
