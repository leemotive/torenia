import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Form from '../form';

class Search extends Component {
  onSubmit = values => {
    this.context._t.query(values);
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

Search.contextTypes = {
  _t: PropTypes.object,
};

export default Search;
