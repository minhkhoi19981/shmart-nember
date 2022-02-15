import { Table } from "antd";
import React from "react";
import PropTypes from "prop-types";
const { default: styled } = require("styled-components");

const StyledTable = styled(Table)`
  & .ant-table-thead > tr > th {
    font-weight: bold;
  }
`;
export default function ITable(props) {
  const { totalCount, onShowSize = () => {}, pageSize } = props;
  return (
    <StyledTable
      size="small"
      scroll={{ x: 1280 }}
      pageSize={pageSize}
      pagination={{
        showSizeChanger: true,
        size: "default ",
        total: totalCount,
        defaultCurrent: 1,
        defaultPageSize: pageSize,
        onShowSizeChange: (current, pageSize) => {
          onShowSize(current, pageSize);
        },
      }}
      {...props}
    />
  );
}

ITable.propTypes = {
  totalCount: PropTypes.number.isRequired,
  // onShowSize: PropTypes.func.isRequired,
  pageSize: PropTypes.number.isRequired,
};
