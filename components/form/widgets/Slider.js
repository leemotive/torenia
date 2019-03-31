import React from 'react';
import { Slider as AntSlider } from 'antd';
import BaseWidget from './BaseWidget';

class Slider extends BaseWidget {
  render() {
    const widgetProps = this.widgetProps();
    return <AntSlider {...widgetProps} />;
  }
}

export default Slider;
