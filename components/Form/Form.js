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

  render() {
    const { layout = 'horizontal', className = '', itemLayout: { labelCol } = {}, onSubmit } = this.props;

    return (
      <AntForm
        onSubmit={this.onSubmit}
        layout={layout}
        className={className}
      >
        {this.resolveFormItem()}
        {onSubmit ? <FormItem style={{verticalAlign: 'middle'}}>
          <Row>
            <Col {...labelCol}></Col>
            <Col>
              <Button type="primary" htmlType="submit" style={{marginRight: 10}}>提交</Button>
              <Button type="default" onClick={this.reset}>重置</Button>
            </Col>
          </Row>
        </FormItem> : null}
      </AntForm>
    )

  }
}
Form.Item = FormItem;

export default AntForm.create()(Form);
