import React, { Component } from 'react';
import NormalField from './NormalField';
import ObjectField from './ObjectField';
import ArrayField from './ArrayField';
import FormContext from '../context';

//const noop = _ => _;

class Field extends Component {
  renderField(context) {
    const { fullname, type } = this.props;
    const { fieldMap } = context;
    if (!fullname) {
      return <ObjectField fullname="" context={context} />;
    } else {
      const field = fieldMap[fullname.replace(/\.\[\d+\]/g, '')];
      if (field.fields) {
        if ((type || field.type) === 'array') {
          return <ArrayField context={context} fullname={fullname} />;
        } else {
          return <ObjectField context={context} fullname={fullname} />;
        }
      } else {
        return <NormalField context={context} fullname={fullname} />;
      }
    }
  }

  render() {
    return (
      <FormContext.Consumer>
        {context => this.renderField(context)}
      </FormContext.Consumer>
    );
  }
}

export default Field;
