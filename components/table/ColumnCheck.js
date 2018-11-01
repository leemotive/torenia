import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Button, Icon, Popover, Tooltip } from 'antd';

const CheckboxGroup = Checkbox.Group;

const ColumnCheck = (props, context) => {

  const { columns, checkColumnBehavior = 'visible' } = props;
  const filterColumns = columns.filter(col => {
    if (col.alwaysShow) return false;
    if (col.alwaysHide) return false;
    if ('operation' === col.type) {
      return false;
    }
    return true;
  }).map(col => ({
    label: col.title, value: col.dataIndex
  }));

  const defaultCheckedColumns = context._t.state.checkedColumns || (checkColumnBehavior === 'visible' ? filterColumns.map(_ => _.value) : []);

  function onCheckColumn([...checkedColumns]) {
    context._t.onCheckColumnChanged(checkedColumns);
  }

  const popOverContent = (
    <CheckboxGroup onChange={onCheckColumn} defaultValue={defaultCheckedColumns} options={filterColumns} className="filterColumnGroup" />
  )

  return (
    <Popover placement="bottomRight" overlayClassName="groupCheckPopover" content={popOverContent} title={`勾选列${checkColumnBehavior === 'visible' ? '显示' : '隐藏'}`} trigger="click">
      <Tooltip  title={`勾选${checkColumnBehavior === 'hidden' ? '隐藏' : '显示'}列`}>
      <Button className="tableActionButton">
        <Icon type="bars" />
      </Button>
      </Tooltip>
    </Popover>
  );
}

ColumnCheck.contextTypes = {
  _t: PropTypes.object
};


export default ColumnCheck;
