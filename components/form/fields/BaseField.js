import { Component } from 'react';
import { resolveWidget } from '../widgets';

class BaseField extends Component {
  getField() {
    const {
      context: { fieldMap, fields },
      fullname,
    } = this.props;
    if (!fullname) {
      return { fields };
    }
    return fieldMap[fullname.replace(/\.\[\d+\]/g, '')];
  }

  getFieldValue() {
    const {
      context: { formData },
      fullname,
    } = this.props;

    const namepath = fullname.split('.');
    let value = formData;
    for (let name of namepath) {
      let match = name.match(/\[(\d+)\]/);
      if (match) {
        value = value[match[1]];
      } else {
        value = value[name];
      }
      if (value == undefined) {
        break;
      }
    }
    return value;
  }

  getWidget() {
    const { widget = 'Input' } = this.getField();
    return typeof widget === 'string' ? resolveWidget(widget) : widget;
  }
}

export default BaseField;
