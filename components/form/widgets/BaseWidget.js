import { Component } from 'react';

class BaseWidget extends Component {
  getValue = e => {
    const { valuePropName = 'value' } = this;
    return e?.target?.[valuePropName] ?? e;
  };

  widgetProps() {
    const { valuePropName = 'value' } = this;
    const { context, name, ...otherProps } = this.props;
    const { formData } = context;
    const widgetProps = {
      [valuePropName]: formData[name],
      onChange: this.onChange,
      ...otherProps,
    };
    return widgetProps;
  }

  onChange = e => {
    const { context, name } = this.props;
    context.onChange(name, this.getValue(e));
  };
}

export default BaseWidget;
