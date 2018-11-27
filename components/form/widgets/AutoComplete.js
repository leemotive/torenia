import React, { Component } from 'react';
import { AutoComplete as AntAutoComplete } from 'antd';

class AutoComplete extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { ...props } = this.props;
    return <AntAutoComplete {...props} />;
  }
}

export default AutoComplete;
