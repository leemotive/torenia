import { Table as AntTable, Popconfirm } from 'antd';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { request } from 'utils';
import Header from './Header';
import Edit from './Edit';

const noop = _ => _;

const defaultPagination = {
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: total => `共 ${total} 条`,
  current: 1,
  pageSize: 10,
  total: 0,
};

class Table extends Component {
  static defaultProps = {
    pageKey: {
      limit: 'limit',
      skip: 'skip',
      order: 'order',
      orderBy: 'orderBy'
    },
    beforeQuery: noop,
    dataPreProcess: noop,
    checkColumnBehavior: 'visible',
    noRowOperation: false,
    editText: '编辑',
    deleteText: '删除',
  }
  constructor(props) {
    super(props);

    const {
      resource,
      api,
      dataSource,
      pagination,
      columns,
      key = 'id',
      noCreate,
    } = props;

    if (!api && !resource && !dataSource) {
      throw '错误使用, api, resource, dataSource至少使用一个';
    }
    this.key = key;
    this.resource = resource;

    this.state = {
      loading: false,
      dataSource,
      pagination: { ...defaultPagination, ...pagination },
      columns,
      checkedColumns: this.resolveDefaultCheckedColumns(),
    };
  }

  getChildContext() {
    return {
      _t: this,
    };
  }
  static childContextTypes = {
    _t: PropTypes.object
  }

  async query(search, pagination, filters, sorter) {
    const { pageKey, beforeQuery, dataPreProcess } = this.props;
    const state = this.state;
    const searchCondition = { ...state.search, ...search };
    const pageCondition = { ...state.pagination, ...pagination };
    const filterCondition = { ...state.filters, ...filters };
    const sortCondition = { ...state.sorter, ...sorter };

    this.setState({
      loading: true,
      search: searchCondition,
      pagination: pageCondition,
      filters: filterCondition,
      sorter: sortCondition,
    });
    let condition = {
      ...searchCondition,
      ...filterCondition,
      [pageKey.limit]: pageCondition.pageSize,
      [pageKey.skip]: (pageCondition.current - 1) * pageCondition.pageSize,
      [pageKey.order]: sortCondition.field,
      [pageKey.orderBy]: sortCondition.order,
    };
    condition = beforeQuery(condition);
    let {data} = await request({
      url: `/api/v1/${this.resource}`,
      data: { ...condition }
    });
    data = dataPreProcess(data);
    this.setState({
      loading: false,
      dataSource: data.data || data.list,
      pagination: { ...pageCondition, total: data.total },
      editVisible: false,
    });
  }

  onCheckColumnChanged = (checkedColumns) => {
    const {
      name
    } = this.props;
    this.setState({
      checkedColumns
    });
    localStorage.setItem(`${name}-checked-columns`, JSON.stringify(checkedColumns));
  }
  resolveColumn() {
    const {
      checkColumnBehavior, noRowOperation
    } = this.props;
    const {
      checkedColumns,
    } = this.state;

    const columns = this.state.columns.filter(column => {
      if (column.type === 'operation') {
        this.operationFormProps = true;
      }
      if (column.alwaysHide) return false;
      if (column.alwaysShow) return true;
      const checked = !checkedColumns || checkedColumns.includes(column.dataIndex);
      return !(checked ^ checkColumnBehavior === 'visible');
    });

    if (!this.operationFormProps && !noRowOperation) {
      const operation = this.resolveRowOperation();
      columns.push(operation);
    }
    return columns;
  }
  resolveDefaultCheckedColumns() {
    const {
      defaultCheckedColumns, name, checkColumnBehavior, columns
    } = this.props;

    let checkedColumns;
    try {
      checkedColumns = JSON.parse(localStorage.getItem(`${name}-checked-columns`));
    } catch (e) { }
    checkedColumns = checkedColumns
      || defaultCheckedColumns
      || (checkColumnBehavior === 'visible' ? columns.filter(column => {
        if (column.type === 'operation') return false;
        if (column.alwaysHide) return false;
        if (column.alwaysShow) return false;
        return true;
      }).map(_ => _.dataIndex) : []);
    return checkedColumns;
  }

  showEdit(record) {
    this.setState({
      editVisible: true,
      record,
    });
  }
  hideEdit() {
    this.setState({
      editVisible: false,
    });
  }
  defaultOperation(types, text, record) {
    let operations = [];
    const { editText, deleteText } = this.props;
    for(let type of types) {
      if ('edit' === type) {
        operations.push(<a key="edit" className="op-btn" onClick={() => this.showEdit(record)}>{editText}</a>);
      } else if ('delete' === type) {
        operations.push(
          <Popconfirm
            key="delete"
            title="确认删除？"
            onConfirm={() => {
              request({method: 'delete', url: `/api/v1/${this.resource}/${record[this.key]}`}).then(data => {
                this.query();
              })
            }}
          >
            <a className="op-btn">{deleteText}</a>
          </Popconfirm>
        )
      }
    }
    return operations;
  }
  resolveRowOperation() {
    const {
      rowOperation,
    } = this.props;
    return {
      title: '操作',
      dataIndex: '@table/operation',
      type: 'operation',
      render: (text, record) => {
        let ops;
        if (typeof rowOperation === 'function') {
          ops = rowOperation(text, record);
        } else if (Array.isArray(rowOperation)) {
          ops = rowOperation.map((op, i) => {
            let originOp = op;
            if (typeof originOp === 'function') {
              originOp = originOp(text, record);
              if (React.isValidElement(originOp)) {
                return React.cloneElement(originOp, {
                  key: `@Table/${i}`,
                  className: `${originOp.props.className || ''} op-btn`
                });
              }
            };
            if (typeof originOp === 'string') return this.defaultOperation([originOp], text, record);
          });
        } else {
          ops = this.defaultOperation(['edit', 'delete'].filter(ac => this.props[`no${ac[0].toUpperCase()}${ac.slice(1)}`] !== true), text, record);
        }
        return <div className="rowOperations">{ops}</div>
      }
    };
  }
  componentDidMount() {
    const { dataSource } = this.state;
    if (!dataSource) {
      this.query();
    }
  }

  onConditionChange = (pagination, filters, sorter) => {
    this.query({}, pagination, filters, sorter);
  }

  render() {
    const filterdColumns = this.resolveColumn();
    const {
      className,
      searchConfig,
      editConfig = {},
      checkColumnBehavior,
      columns,
      tableOperation,
      noCreate,
      noColumnCheck,
    } = this.props;
    const {
      dataSource,
      pagination,
      editVisible,
      record,
    } = this.state;

    const noOperation = {
      noColumnCheck, noCreate
    };

    const columnCheckConfig = {
      columns,
      checkColumnBehavior,
      noColumnCheck,
    };
    editConfig.defaultValue = record;
    return (
      <div className={classnames('table-wrap no-wrap-table', className)}>
        <Header tableOperation={tableOperation} noOperation={noOperation} columnCheckConfig={columnCheckConfig} searchConfig={searchConfig} />
        <AntTable
          columns={ filterdColumns }
          dataSource={ dataSource }
          rowKey={ this.key }
          pagination={ pagination }
          onChange={ this.onConditionChange }
          scroll={{ x: true }}
        />
        <Edit visible={editVisible} columns={columns} editConfig={editConfig} />
      </div>
    );
  }
}

export default Table;
