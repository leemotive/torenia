import Form from '../Form';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { request } from 'utils';
import React, { Component } from 'react';

class Edit extends Component {
  constructor(props, context) {
    super(props);
    this.key = context._t.key;
  }

  static buildFormOption = (props, isEdit) => {
    const {
      columns,
      editConfig: { fields: fieldOption = {}, ...others },
    } = props;
    const itemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    }
    const fields = columns.filter(col => {
      const { formOption: { noCreate, noEdit } = {} } = col;
      const noCE = isEdit ? noEdit : noCreate;
      return col.type !== 'operation'
        && !col.dataIndex.startsWith('@')
        && !noCE
    }).map(col => {
      const { title, dataIndex, formOption: { noCreate, noEdit, ...others } = {} } = col;
      return {
        label: title,
        name: dataIndex,
        ...others,
        ...fieldOption[dataIndex]
      };
    });
    return { fields, itemLayout, ...others };
  }
  buildModalInfo() {
    const { editConfig: { defaultValue = {} } } = this.props;
    this.id = defaultValue[this.key];
    this.isEdit = this.id !== undefined;
  }
  onSubmit = (values) => {
    const id = this.isEdit ? this.id : undefined;
    const idUrl = id ? `/${id}` : '';

    return request({
      url: `/api/v1/${this.context._t.resource}${idUrl}`,
      method: id ? 'PUT' : 'POST',
      data: values
    }).then(_ => {
      this.context._t.query();
    });
  }


  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.visible ^ this.props.visible) {
      this.reset = true;
    }
    if (!nextProps.visible && !this.props.visible) {
      return false;
    }
    return true;
  }

  componentDidUpdate() {
    this.reset && this.form && setTimeout(() => this.form.resetFields(), 100);
    this.reset = false;
  }

  render() {
    const {
      visible
    } = this.props;
    this.buildModalInfo();
    const formOption = { ...Edit.buildFormOption(this.props, this.isEdit), onSubmit: this.onSubmit };

    return (
      <Modal
        title={this.isEdit ? '编辑' : '新增'}
        visible={visible}
        footer={null}
        onCancel={() => this.context._t.hideEdit()}
      >
        <Form
          ref={r => this.form = r}
          { ...formOption }
        />
      </Modal>
    )
  }
}

Edit.contextTypes = {
  _t: PropTypes.object
};

export default Edit;
