import React, { Component } from 'react';
import { Form as AntForm } from 'antd';
import { resolveWidget } from './widgets';

const { Item: FormItem } = AntForm;
const noop = _ => _;

class Field extends Component {
  static defaultProps = {
    decorator: {},
    itemProps: {},
    widget: 'Input',
  };

  constructor(props) {
    super(props);
  }

  render() {
    let {
      label,
      name,
      defaultValue,
      widget,
      itemProps: { ...itemProps },
      decorator: { ...decorator },
      getValueFromEvent,
      dependency,
      form,
      ...others
    } = this.props;

    const Widget = typeof widget === 'string' ? resolveWidget(widget) : widget;

    label && (itemProps.label = label);
    decorator.initialValue = (Widget.transform || noop)(defaultValue);
    Widget.valuePropName && (decorator.valuePropName = Widget.valuePropName);
    getValueFromEvent && (decorator.getValueFromEvent = getValueFromEvent);

    const { getFieldDecorator, getFieldValue } = form;
    if ('object' == typeof dependency) {
      if ('object' === typeof dependency.$or) {
        if (
          Object.entries(dependency.$or).every(f => getFieldValue(f[0]) != f[1])
        ) {
          return null;
        }
      } else {
        if (Object.entries(dependency).some(f => getFieldValue(f[0]) != f[1])) {
          return null;
        }
      }
    } else if ('function' === typeof dependency) {
      if (!dependency(getFieldValue)) {
        return null;
      }
    }
    return (
      <FormItem {...itemProps}>
        {getFieldDecorator(name, {
          ...decorator,
        })(<Widget {...others} />)}
      </FormItem>
    );
  }
}

export default Field;
