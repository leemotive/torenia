import Form from '../form';
import PropTypes from 'prop-types';
import { Modal, Drawer } from 'antd';
import { request } from '../utils';
import React, { Component } from 'react';
import options from './options';
import { Consumer } from './context';

class Edit extends Component {
  static propTypes = {
    beforeSave: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.rowKey = props.context._t.props.rowKey;
    this.formRef = React.createRef();
  }

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
      url: `${options.apiPrefix}/${this.props.context._t.resource}${idUrl}`,
      method: id ? 'PUT' : 'POST',
      data: values,
    }).then(() => {
      this.props.context._t.query();
    });
  };

  shouldComponentUpdate(nextProps) {
    if (!nextProps.visible && !this.props.visible) {
      return false;
    }
    return true;
  }

  render() {
    const { visible, formType, width } = this.props;
    this.buildModalInfo();
    const {
      render,
      editTitle = '编辑',
      createTitle = '新增',
      ...formOption
    } = {
      ...EditInterface.buildFormOption(this.props, this.isEdit),
      onSubmit: this.onSubmit,
    };

    const form = (
      <Form ref={this.formRef} {...formOption}>
        {render || null}
      </Form>
    );

    if (formType === 'Modal') {
      return (
        <Modal
          title={this.isEdit ? editTitle : createTitle}
          visible={visible}
          footer={null}
          destroyOnClose={true}
          onCancel={() => this.props.context._t.hideEdit()}
        >
          {form}
        </Modal>
      );
    } else {
      return (
        <Drawer
          title={this.isEdit ? editTitle : createTitle}
          placement="right"
          closable={true}
          visible={visible}
          width={width}
          onClose={() => this.props.context._t.hideEdit()}
        >
          {form}
        </Drawer>
      );
    }
  }
}

function EditInterface(props) {
  return (
    <Consumer>{context => <Edit {...props} context={context} />}</Consumer>
  );
}
EditInterface.buildFormOption = (props, isEdit) => {
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

export default EditInterface;
