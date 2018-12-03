import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Button, Icon, Popover, Tooltip } from 'antd';
import { Consumer } from './context';

const CheckboxGroup = Checkbox.Group;

const ColumnCheck = ({ context, ...props }) => {
  const { columns, checkColumnBehavior } = props;
  const filterColumns = columns
    .filter(col => {
      if (col.alwaysShow) return false;
      if (col.alwaysHide) return false;
      if ('operation' === col.type) {
        return false;
      }
      return true;
    })
    .map(col => ({
      label: col.title,
      value: col.dataIndex,
    }));

  const defaultCheckedColumns =
    context._t.state.checkedColumns ||
    (checkColumnBehavior === 'visible' ? filterColumns.map(_ => _.value) : []);

  function onCheckColumn([...checkedColumns]) {
    context._t.onCheckColumnChanged(checkedColumns);
  }

  const popOverContent = (
    <CheckboxGroup
      onChange={onCheckColumn}
      defaultValue={defaultCheckedColumns}
      options={filterColumns}
      className="filterColumnGroup"
    />
  );

  return (
    <Popover
      placement="bottomRight"
      overlayClassName="groupCheckPopover"
      content={popOverContent}
      title={`勾选列${checkColumnBehavior === 'visible' ? '显示' : '隐藏'}`}
      trigger="click"
    >
      <Tooltip
        title={`勾选${checkColumnBehavior === 'hidden' ? '隐藏' : '显示'}列`}
      >
        <Button className="tableActionButton">
          <Icon type="bars" />
        </Button>
      </Tooltip>
    </Popover>
  );
};

ColumnCheck.defaultProps = {
  checkColumnBehavior: 'visible',
};
ColumnCheck.propTypes = {
  columns: PropTypes.array,
};

export default function(props) {
  return (
    <Consumer>
      {context => <ColumnCheck {...props} context={context} />}
    </Consumer>
  );
}
