import { Component } from 'react';
import { Form } from 'antd';
import { resolveWidget } from '../widgets';
import utils from '../../utils/utils';

const { Item: FormItem } = Form;

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

    return utils.getPathNameData(formData, fullname);
  }

  getWidget() {
    const { widget = 'Input' } = this.getField();
    return typeof widget === 'string' ? resolveWidget(widget) : widget;
  }

  getFieldItem(children) {
    const field = this.getField();
    const { label, itemProps = {} } = field;

    itemProps.label = label;
    return <FormItem {...itemProps}>{children}</FormItem>;
  }
}

export default BaseField;
