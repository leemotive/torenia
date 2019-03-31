import React, { Component } from 'react';
import { Form as AntForm, Button } from 'antd';
import { registerFormWidget } from './widgets';
import Field from './Field';
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

  static getDerivedStateFromProps({ value, fields }, { formData, ...others }) {
    return { ...others, fields, formData: { ...formData, ...value } };
  }

  onSubmit = () => {};
  reset = e => {
    e && e.preventDefault();
  };

  resolveFormItem() {
    const { fields } = this.state;

    const items = [];
    for (let field of fields) {
      if (typeof field === 'function') {
        const funcField = field(this.props);
        items.push(React.cloneElement(funcField, { key: items.length }));
      } else {
        field.key || (field.key = items.length);
        items.push(<Field {...field} />);
      }
    }
    return items;
  }

  resolveWidget = name => {
    const { fields } = this.state;
    //const { form } = this.props;
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
  onDataChangge = (name, value) => {
    const { controlled } = this.state;
    if (controlled) {
      this.props?.onChange?.(name, value);
    } else {
      const { formData } = this.state;
      formData[name] = value;
      this.setState({
        formData,
      });
    }
  };
  get formContext() {
    const { formData } = this.state;

    return {
      formData,
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

Form.registerFormWidget = registerFormWidget;

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
