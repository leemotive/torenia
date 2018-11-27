import React, { Component } from 'react';
import { Form as AntForm, Button } from 'antd';
import { registerFormWidget } from './widgets';
import Field from './Field';

const FormItem = AntForm.Item;

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onSubmit = e => {
    e && e.preventDefault();
    const {
      form: { validateFieldsAndScroll },
    } = this.props;

    validateFieldsAndScroll((errors, values) => {
      if (errors) return;
      this.props.onSubmit(values, { event: e });
    });
  };
  reset = e => {
    e && e.preventDefault();
    const {
      onReset,
      form: { resetFields },
    } = this.props;
    resetFields();
    onReset();
  };

  static getDerivedStateFromProps(nextProps) {
    const { fields, defaultValue, itemLayout } = nextProps;

    for (let field of fields) {
      const { name } = field;
      if (typeof field.widget !== 'function') {
        field.defaultValue = defaultValue[name];
        field.itemProps = {
          ...field.itemProps,
          ...itemLayout,
          ...field.layout,
        };
      }
    }

    return { fields };
  }

  resolveFormItem() {
    const { fields } = this.state;
    const { form } = this.props;

    const items = [];
    for (let field of fields) {
      if (typeof field === 'function') {
        const funcField = field(this.props);
        items.push(React.cloneElement(funcField, { key: items.length }));
      } else {
        field.key || (field.key = items.length);
        items.push(<Field {...field} form={form} />);
      }
    }
    return items;
  }

  resolveWidget = name => {
    const { fields } = this.state;
    const { form } = this.props;
    const field = fields.find(field => field.name === name);
    return <Field {...field} form={form} />;
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
    const { children, opProps, opBtn } = this.props;
    opProps.key || (opProps.key = '@form.op');

    if ('function' === typeof children) {
      return children(this.resolveWidget, this.getBtn);
    } else {
      return [
        this.resolveFormItem(),
        opBtn === false ? null : (
          <FormItem {...opProps}>{this.renderOp()}</FormItem>
        ),
      ];
    }
  }

  render() {
    const { layout, className } = this.props;

    return (
      <AntForm onSubmit={this.onSubmit} layout={layout} className={className}>
        {this.renderForm()}
      </AntForm>
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

export default AntForm.create()(Form);
