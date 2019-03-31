import React from 'react';
import { AutoComplete as AntAutoComplete } from 'antd';
import BaseWidget from './BaseWidget';

class AutoComplete extends BaseWidget {
  render() {
    let widgetProps = this.widgetProps();
    return <AntAutoComplete {...widgetProps} />;
  }
}

export default AutoComplete;
