import { Table as AntTable, Popconfirm } from 'antd';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { request } from '../utils';
import Header from './Header';
import Edit from './Edit';
import Form from '../form';
import options, { config as configTable } from './options';
import { Provider as TableProvider } from './context';

const noop = _ => _;

class Table extends Component {
  static getEditFormOption = Edit.buildFormOption;
  static config = configTable;
  static defaultProps = {
    pageKey: {
      limit: 'limit',
      skip: 'skip',
      order: 'order',
      orderBy: 'orderBy',
    },
    className: '',
    beforeQuery: noop,
    beforeSave: noop,
    dataPreProcess: noop,
    checkColumnBehavior: 'visible',
    noRowOperation: false,
    editText: '编辑',
    deleteText: '删除',
    deleteTip: '确认删除',
    noPagination: false,
    autoQuery: true,
    rowKey: 'id',
    locale: {
      filterConfirm: '确定',
      filterReset: '清空',
      empty: '暂无数据',
    },
  };
  static propTypes = {
    editText: PropTypes.string,
    deleteText: PropTypes.string,
  };
  constructor(props) {
    super(props);

    const { resource, api, dataSource, pagination, columns } = props;

    if (!api && !resource && !dataSource) {
      throw '错误使用, api, resource, dataSource至少使用一个';
    }
    this.resource = resource;

    this.state = {
      loading: false,
      dataSource,
      pagination: { ...options.defaultPagination, ...pagination },
      columns,
      checkedColumns: this.resolveDefaultCheckedColumns(),
    };
  }

  async query(search, pagination, filters, sorter) {
    const { pageKey, beforeQuery, dataPreProcess } = this.props;
    const state = this.state;
    const searchCondition = { ...state.search, ...search };
    const pageCondition = { ...state.pagination, ...pagination };
    const filterCondition = { ...state.filters, ...filters };
    const sortCondition = sorter || { ...state.sorter };

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
      [pageKey.order]: sortCondition.order && sortCondition.order.slice(0, -3),
      [pageKey.orderBy]: sortCondition.field,
    };
    condition = beforeQuery(condition);
    if (!condition) {
      this.setState({
        loading: false,
      });
      return;
    }
    let data = await request({
      url: `${options.apiPrefix}/${this.resource}`,
      data: { ...condition },
    });
    data = dataPreProcess(options.globalDataPreProcess(data));
    this.setState({
      loading: false,
      dataSource: data.data || data.list,
      pagination: { ...pageCondition, total: data.total },
      editVisible: false,
    });
  }

  onCheckColumnChanged = checkedColumns => {
    const { name } = this.props;
    this.setState({
      checkedColumns,
    });
    localStorage.setItem(
      `${name}-checked-columns`,
      JSON.stringify(checkedColumns),
    );
  };
  resolveColumn() {
    const { checkColumnBehavior, noRowOperation, locale } = this.props;
    const { checkedColumns } = this.state;

    const columns = this.state.columns.filter(column => {
      if (column.type === 'operation') {
        this.operationFormProps = true;
      }
      if (column.alwaysHide) return false;

      if (column.filter) {
        const { formOption = {} } = column;
        if (formOption.options) {
          column.filters ||
            (column.filters = formOption.options.map(o => ({
              text: o.label,
              value: o.value,
            })));
        } else if (!column.filterDropdown) {
          column.filterDropdown = ({ confirm, setSelectedKeys }) => {
            const formConfig = {
              fields: [{ name: column.dataIndex }],
              onSubmit: formData => {
                setSelectedKeys(formData[column.dataIndex]);
                confirm();
              },
              onReset: () => {
                setSelectedKeys(undefined);
                confirm();
              },
              layout: 'inline',
              opProps: {
                wrapperCol: { offset: 0 },
              },
              submitText: locale.filterConfirm,
              resetText: locale.filterReset,
              className: 'table-filter-dropdown',
            };
            return <Form {...formConfig} />;
          };
        }
      }

      if (column.alwaysShow) return true;
      const checked =
        !checkedColumns || checkedColumns.includes(column.dataIndex);
      return !(checked ^ (checkColumnBehavior === 'visible'));
    });

    if (!this.operationFormProps && !noRowOperation) {
      const operation = this.resolveRowOperation();
      columns.push(operation);
    }
    return columns;
  }
  resolveDefaultCheckedColumns() {
    const {
      defaultCheckedColumns,
      name,
      checkColumnBehavior,
      columns,
    } = this.props;

    let checkedColumns;
    try {
      checkedColumns = JSON.parse(
        localStorage.getItem(`${name}-checked-columns`),
      );
    } catch (e) {}
    checkedColumns =
      checkedColumns ||
      defaultCheckedColumns ||
      (checkColumnBehavior === 'visible'
        ? columns
            .filter(column => {
              if (column.type === 'operation') return false;
              if (column.alwaysHide) return false;
              if (column.alwaysShow) return false;
              return true;
            })
            .map(_ => _.dataIndex)
        : []);
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
    const { editText, deleteText, deleteTip, rowKey } = this.props;
    for (let type of types) {
      if ('edit' === type) {
        operations.push(
          <a
            key="edit"
            className="op-btn"
            onClick={() => this.showEdit(record)}
          >
            {editText}
          </a>,
        );
      } else if ('delete' === type) {
        operations.push(
          <Popconfirm
            key="delete"
            title={`${deleteTip}?`}
            onConfirm={() => {
              request({
                method: 'delete',
                url: `${options.apiPrefix}/${this.resource}/${record[rowKey]}`,
              }).then(() => {
                this.query();
              });
            }}
          >
            <a className="op-btn">{deleteText}</a>
          </Popconfirm>,
        );
      }
    }
    return operations;
  }
  resolveRowOperation() {
    const { rowOperation, rowOperationProps } = this.props;
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
                  className: `${originOp.props.className || ''} op-btn`,
                });
              }
            }
            if (typeof originOp === 'string')
              return this.defaultOperation([originOp], text, record);
          });
        } else {
          ops = this.defaultOperation(
            ['edit', 'delete'].filter(
              ac =>
                this.props[`no${ac[0].toUpperCase()}${ac.slice(1)}`] !== true,
            ),
            text,
            record,
          );
        }
        return <div className="rowOperations">{ops}</div>;
      },
      ...rowOperationProps,
    };
  }
  componentDidMount() {
    const { dataSource } = this.state;
    const { autoQuery } = this.props;
    if (!dataSource && autoQuery) {
      this.query();
    }
  }

  onConditionChange = (pagination, filters, sorter) => {
    this.query({}, pagination, filters, sorter);
  };

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
      noRefresh,
      noPagination,
      beforeSave,
      ...others
    } = this.props;
    const { dataSource, pagination, editVisible, record } = this.state;

    const noOperation = {
      noColumnCheck,
      noCreate,
      noRefresh,
    };

    const columnCheckConfig = {
      columns,
      checkColumnBehavior,
      noColumnCheck,
    };
    editConfig.defaultValue = record;
    return (
      <div className={`${className} table-wrap no-wrap-table`}>
        <TableProvider value={{ _t: this }}>
          <Header
            tableOperation={tableOperation}
            noOperation={noOperation}
            columnCheckConfig={columnCheckConfig}
            searchConfig={searchConfig}
          />
          <AntTable
            columns={filterdColumns}
            dataSource={dataSource}
            pagination={!noPagination && pagination}
            onChange={this.onConditionChange}
            scroll={{ x: true }}
            {...others}
          />
          <Edit
            visible={editVisible}
            columns={columns}
            editConfig={editConfig}
            beforeSave={beforeSave}
          />
        </TableProvider>
      </div>
    );
  }
}

export default Table;
