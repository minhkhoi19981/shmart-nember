import ITable from "./Table/index";
import ISelect from "./Select/index";
import ISvg from "./SVG/index";
import ITableHtml from "./ITableHtml";

import { Select } from "antd";
import React from "react";
import PropTypes from "prop-types";
const { Option } = Select;
function ISelectV1(props) {
  const { dataOption = [], keyName, valueName } = props;
  return (
    <Select {...props}>
      {dataOption.map((item) => (
        <Option value={item[keyName]} key={item[keyName]}>
          {item[valueName]}
        </Option>
      ))}
    </Select>
  );
}

ISelectV1.propTypes = {
  dataOption: PropTypes.array.isRequired,
  keyName: PropTypes.string.isRequired,
  valueName: PropTypes.string.isRequired,
};

export { ITable, ISelect, ISvg, ITableHtml, ISelectV1 };
