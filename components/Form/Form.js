import React, { Component } from "react";
import { Form as AntForm, Button, Row, Col } from 'antd';
import { resolveWidget } from './widgets';
const FormItem  = AntForm.Item;

const noop = _ => _;

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  onSubmit = (e) => {
    e && e.preventDefault();
    const {
      form: {
        validateFieldsAndScroll
      }
    } = this.props;

    validateFieldsAndScroll((errors, values) => {
      if (errors) return;
      this.props.onSubmit(values, { event: e });
    });
  }
  reset = (e) => {
    e && e.preventDefault();
    const {
      form: {
        resetFields
      }
    } = this.props;
    resetFields();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return { fields: nextProps.fields };
  }

  resolveFormItem() {
    const {
      fields,
    } = this.state;
    const {
      defaultValue = {},
      form: {
        getFieldDecorator
      },
      itemLayout,
    } = this.props;

    const items = [];
    for(let field of fields) {
      if (typeof field === 'function') {
        const widget = field(this.props);
        items.push(React.cloneElement(widget, { key: items.length }));
      } else {
        const Widget = resolveWidget(field.widget || 'Input');
        const {
          label, name, layout, itemOption, getValueFromEvent, decoratorOption, ...others
        } = field;
        const itemProps = {
          key: items.length,
          ...itemOption,
        };
        if (label) {
          itemProps.label = label;
        }
        const decorator = {
          initialValue: (Widget.transform || noop)(defaultValue[name]),
          ...decoratorOption,
        };
        if (Widget.valuePropName) {
          decorator.valuePropName = Widget.valuePropName;
        }
        if (getValueFromEvent) {
          decorator.getValueFromEvent = getValueFromEvent;
        }
        items.push(
          <FormItem { ...itemProps } { ...{...itemLayout, ...layout} }>
            {getFieldDecorator(name, {
              ...decorator
            })(
              <Widget { ...others } />
            )}
          </FormItem>
        )
      }
    }
    return items;
  }

  getBtn(name) {
    if ('submit' === name) {
      return <Button type="primary" key="torenia.form.submit" className="form-submit-btn" htmlType="submit" style={{marginRight: 10}}>{this.props.submitText}</Button>;
    } else if ('reset' === name) {
      return <Button type="default" key="torenia.form.reset" className="form-submit-reset" onClick={this.reset}>{this.props.resetText}</Button>;
    }
    return null;
  }

  renderOp() {
    let {
      children
    } = this.props;


    if (!React.Children.count(children)) {
      return [
        this.submitBtn,
        this.resetBtn,
      ];
    }

    if ('function' === typeof children) {
      children = children(this);
    }

    return React.Children.map(children, child => {
      if ('string' === typeof child) {
        child = this.getBtn(child);
      }
      return React.cloneElement(child, { key: child.key || index });
    });
  }


  render() {
    const {
      layout = 'horizontal',
      className = '',
    } = this.props;

    return (
      <AntForm
        onSubmit={this.onSubmit}
        layout={layout}
        className={className}
      >
        {this.resolveFormItem()}

        {this.renderOp()}

      </AntForm>
    )

  }
}
Form.Item = FormItem;

Form.defaultProps = {
  submitText: '提交',
  resetText: '重置',
  onSubmit: () => {}
}

export default AntForm.create()(Form);
