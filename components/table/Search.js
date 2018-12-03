import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Form from '../form';
import { Consumer } from './context';

class Search extends Component {
  static propTypes = {
    formOption: PropTypes.object,
  };

  onSubmit = values => {
    this.props.context._t.query(values);
  };
  render() {
    const { formOption } = this.props;
    if (!formOption) {
      return null;
    }
    return (
      <Form
        {...formOption}
        layout="inline"
        className="searchForm"
        onSubmit={this.onSubmit}
        opProps={{
          wrapperCol: { offset: 0 },
        }}
      />
    );
  }
}

export default function(props) {
  return (
    <Consumer>{context => <Search {...props} context={context} />}</Consumer>
  );
}
