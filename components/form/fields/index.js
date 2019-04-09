import React, { Component } from 'react';
import NormalField from './NormalField';
import ObjectField from './ObjectField';
import ArrayField from './ArrayField';
import FormContext, { MessageContext } from '../context';

//const noop = _ => _;

class Field extends Component {
  renderField(context, messageContext) {
    const { fullname, type, noItem } = this.props;
    const { fieldMap } = context;
    if (!fullname) {
      return (
        <ObjectField
          fullname=""
          context={context}
          messageContext={messageContext}
        />
      );
    } else {
      const field = fieldMap[fullname.replace(/\.\[\d+\]/g, '')];
      if (field.fields) {
        if ((type || field.type) === 'array') {
          return (
            <ArrayField
              context={context}
              messageContext={messageContext}
              fullname={fullname}
            />
          );
        } else {
          return (
            <ObjectField
              context={context}
              messageContext={messageContext}
              fullname={fullname}
              noItem={noItem}
            />
          );
        }
      } else {
        return (
          <NormalField
            context={context}
            messageContext={messageContext}
            fullname={fullname}
          />
        );
      }
    }
  }

  render() {
    return (
      <FormContext.Consumer>
        {context => (
          <MessageContext.Consumer>
            {messageContext => this.renderField(context, messageContext)}
          </MessageContext.Consumer>
        )}
      </FormContext.Consumer>
    );
  }
}

export default Field;
