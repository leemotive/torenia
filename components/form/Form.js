import React, { Component } from 'react';
import { Form as AntForm, Button } from 'antd';
import Field from './fields';
import FormContext from './context';

const FormItem = AntForm.Item;

class Form extends Component {
  constructor(props) {
    super(props);
    const { value, defaultValue } = props;
    this.state = {
      formData: { ...defaultValue, ...value },
      controlled: !!value,
    };
  }

  static getDerivedStateFromProps({ value }, { formData, ...others }) {
    return { ...others, formData: { ...formData, ...value } };
  }

  onSubmit = () => {};
  reset = e => {
    e && e.preventDefault();
  };

  resolveFormItem() {
    return <Field fullname="" />;
  }

  resolveWidget = name => {
    const { fields } = this.props;
    const field = fields.find(field => field.name === name);
    return <Field {...field} />;
  };

  getBtn = name => {
    if ('submit' === name) {
      return (
        <Button
          type="primary"
          key="torenia.form.submit"
          className="form-submit-btn"
          htmlType="submit"
          style={{ marginRight: 10 }}
        >
          {this.props.submitText}
        </Button>
      );
    } else if ('reset' === name) {
      return (
        <Button
          type="default"
          key="torenia.form.reset"
          className="form-submit-reset"
          onClick={this.reset}
        >
          {this.props.resetText}
        </Button>
      );
    }
    return null;
  };

  renderOp() {
    let { children, opBtn } = this.props;
    children = opBtn || children;

    if (!React.Children.count(children)) {
      return [this.getBtn('submit'), this.getBtn('reset')].filter(_ => _);
    }

    return React.Children.map(children, (child, index) => {
      if ('string' === typeof child) {
        child = this.getBtn(child);
      }
      return React.cloneElement(child, { key: child.key || index });
    });
  }

  renderForm() {
    const { children, opProps /* opBtn */ } = this.props;
    opProps.key || (opProps.key = '@form.op');

    if ('function' === typeof children) {
      return children(this.resolveWidget, this.getBtn);
    } else {
      return [
        this.resolveFormItem(),
        /* opBtn === false ? null : (
          <FormItem {...opProps}>{this.renderOp()}</FormItem>
        ), */
      ];
    }
  }
  onDataChangge = ({ name, value }) => {
    const { controlled } = this.state;
    const { formData } = this.state;
    if (!controlled) {
      formData[name] = value;
      this.setState({
        formData,
      });
    }
    this.props?.onChange?.(name, value, formData);
  };
  get formContext() {
    const { formData } = this.state;
    const { fields } = this.props;

    const stack = [...fields, ''];
    const fieldMap = {};
    let namePrefix = '';
    while (stack.length) {
      const field = stack.pop();
      if (typeof field === 'string') {
        namePrefix = field;
        continue;
      }
      const fieldName = `${namePrefix}.${field.name}`.replace(/^\./, '');
      fieldMap[fieldName] = field;

      if (field.fields) {
        stack.push(namePrefix, ...field.fields, fieldName);
      }
    }

    return {
      formData,
      fields,
      fieldMap,
      onChange: this.onDataChangge,
    };
  }

  render() {
    const { layout, className } = this.props;

    return (
      <FormContext.Provider value={this.formContext}>
        <AntForm onSubmit={this.onSubmit} layout={layout} className={className}>
          {this.renderForm()}
        </AntForm>
      </FormContext.Provider>
    );
  }
}
Form.Item = FormItem;

Form.defaultProps = {
  submitText: '提交',
  resetText: '重置',
  layout: 'horizontal',
  className: '',
  defaultValue: {},
  opProps: {
    wrapperCol: { offset: 5 },
  },
  onSubmit: () => {},
  onReset: () => {},
};

export default Form;
