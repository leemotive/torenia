import React, { Component } from "react";
import PropTypes from 'prop-types';
import Form from '../Form';

class Search extends Component {
  onSubmit = (values) => {
    this.context._t.query(values);
  }
  render() {
    const { formOption } = this.props;
    if (!formOption) {
      return null;
    }
    return (
      <Form
        { ...formOption }
        layout="inline"
        className="searchForm"
        onSubmit={this.onSubmit}
      />
    )
  }
}

Search.contextTypes = {
  _t: PropTypes.object
};

export default Search;
