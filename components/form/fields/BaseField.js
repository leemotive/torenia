import { Component } from 'react';
import { Form } from 'antd';
import { resolveWidget } from '../widgets';
import utils from '../../utils/utils';
import Validator from '../validator';

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

  getFieldError() {
    const {
      context: { errorData = {} },
      fullname,
    } = this.props;
    return fullname && utils.getPathNameData(errorData, fullname);
  }

  getFieldItem(children) {
    const field = this.getField();
    const { label, title, itemProps = {} } = field;
    const message = this.getFieldError();
    if (message && typeof message === 'string') {
      itemProps.help = message;
      itemProps.validateStatus = 'error';
    } else {
      delete itemProps.help;
      delete itemProps.validateStatus;
    }
    if (label !== false) {
      itemProps.label = label || title;
    }

    return <FormItem {...itemProps}>{children}</FormItem>;
  }

  validate = () => {
    const {
      fullname,
      context: { formData },
    } = this.props;
    const field = this.getField();
    const { validator: { message, rules = {} } = {} } = field;

    const failed = Object.entries(rules).some(([rule, config]) => {
      if (!utils.isPlainObject(config)) {
        config = { params: [].concat(config) };
      }
      const valid = Validator[rule]({
        fullname,
        value: utils.getPathNameData(formData, fullname),
        ...config,
        formData,
      });
      if (valid !== true) {
        this.onError({
          config,
          rule,
          valid: false,
          message: valid || message,
        });
      }
      return valid !== true;
    });
    if (!failed) {
      this.onError({
        valid: true,
      });
    }

    return !failed;
  };

  onError({ rule, message, valid, config }) {
    const field = this.getField();
    const { label, title } = field;
    const { name, fullname, context, messageContext } = this.props;
    if (!valid) {
      message = utils.format(
        message || messageContext[rule] || messageContext.default,
        [].concat(config.params),
        { ...field, title: title || (typeof label === 'string' ? label : '') },
      );
    }
    context.onValidate({
      rule,
      name,
      fullname,
      valid,
      ...config,
      message,
    });
  }

  debounceValidate = utils.debounce(this.validate, 200, {
    leading: false,
    trailing: true,
  });

  onChange = () => {
    this.debounceValidate();
  };
}

export default BaseField;
