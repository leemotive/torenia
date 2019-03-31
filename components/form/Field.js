import React, { Component } from 'react';
import { Form as AntForm } from 'antd';
import { resolveWidget } from './widgets';
import FormContext from './context';

const { Item: FormItem } = AntForm;
//const noop = _ => _;

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
      widget,
      itemProps: { ...itemProps },
      ...others
    } = this.props;

    const Widget = typeof widget === 'string' ? resolveWidget(widget) : widget;

    return (
      <FormContext.Consumer>
        {context => (
          <FormItem {...itemProps}>
            <Widget {...others} name={name} context={context} />
          </FormItem>
        )}
      </FormContext.Consumer>
    );
  }
}

export default Field;
