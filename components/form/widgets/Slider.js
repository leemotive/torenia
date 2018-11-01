import { Slider as AntSlider } from 'antd';
import React, { Component } from 'react';

class Slider extends Component {
  render() {
    const { ...props } = this.props;
    return <AntSlider { ...props } />
  }
}

export default Slider;
