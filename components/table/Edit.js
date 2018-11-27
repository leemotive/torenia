import Form from '../form';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { request } from '../utils';
import React, { Component } from 'react';
import options from './options';

class Edit extends Component {
  constructor(props, context) {
    super(props);
    this.rowKey = context._t.props.rowKey;
    this.formRef = React.createRef();
  }

  static buildFormOption = (props, isEdit) => {
    let {
      columns,
      editConfig: { fields: extraFields = [], ...others },
    } = props;
    const itemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };

    const extraFieldsMap = {};
    extraFields.forEach(field => {
      extraFieldsMap[field.name] = field;
    });

    let fields = columns
      .map(col => {
        const { dataIndex, title, formOption } = col;
        let newCol = {
          label: title,
          name: dataIndex,
          ...formOption,
        };
        if (!dataIndex) {
          return newCol;
        }
        const extraField = extraFieldsMap[dataIndex];
        delete extraFieldsMap[dataIndex];
        return {
          ...newCol,
          ...extraField,
        };
      })
      .concat(Object.values(extraFieldsMap))
      .filter(col => {
        const { noCreate, noEdit } = col;
        const noCE = isEdit ? noEdit : noCreate;
        delete col.noCreate;
        delete col.noEdit;
        return col.type !== 'operation' && !col.name.startsWith('@') && !noCE;
      });

    return { fields, itemLayout, ...others };
  };
  buildModalInfo() {
    const {
      editConfig: { defaultValue = {} },
    } = this.props;
    this.id = defaultValue[this.rowKey];
    this.isEdit = this.id !== undefined;
  }
  onSubmit = values => {
    const { beforeSave } = this.props;
    const id = this.isEdit ? this.id : undefined;
    const idUrl = id ? `/${id}` : '';

    values = beforeSave(values);
    if (!values) {
      return;
    }

    return request({
      url: `${options.apiPrefix}/${this.context._t.resource}${idUrl}`,
      method: id ? 'PUT' : 'POST',
      data: values,
    }).then(() => {
      this.context._t.query();
    });
  };

  shouldComponentUpdate(nextProps) {
    if (!nextProps.visible && !this.props.visible) {
      return false;
    }
    return true;
  }

  render() {
    const { visible } = this.props;
    this.buildModalInfo();
    const {
      render,
      editTitle = '编辑',
      createTitle = '新增',
      ...formOption
    } = {
      ...Edit.buildFormOption(this.props, this.isEdit),
      onSubmit: this.onSubmit,
    };

    return (
      <Modal
        title={this.isEdit ? editTitle : createTitle}
        visible={visible}
        footer={null}
        destroyOnClose={true}
        onCancel={() => this.context._t.hideEdit()}
      >
        <Form ref={this.formRef} {...formOption}>
          {render || null}
        </Form>
      </Modal>
    );
  }
}

Edit.contextTypes = {
  _t: PropTypes.object,
};

export default Edit;
