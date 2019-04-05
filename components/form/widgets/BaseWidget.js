import { Component } from 'react';
import utils from '../../utils/utils';

class BaseWidget extends Component {
  getValue = e => {
    const { valuePropName = 'value' } = this;
    return e?.target?.[valuePropName] ?? e;
  };

  widgetProps() {
    const { valuePropName = 'value' } = this;
    const { context, name, fullname, ...otherProps } = this.props;
    const { formData } = context;
    const widgetProps = {
      [valuePropName]: utils.getPathNameData(formData, fullname),
      ...otherProps,
      onChange: this.onChange,
    };
    return widgetProps;
  }

  validate() {
    /* const { validator } = this.props;
    const entries = Object.entries(validator); */
  }

  onChange = e => {
    const { context, name, fullname, onChange } = this.props;
    const value = this.getValue(e);
    this.validate();
    if (typeof onChange === 'function') {
      onChange({ name, fullname, value, context });
    }
    context.onChange({ name, fullname, value });
  };
}

export default BaseWidget;
