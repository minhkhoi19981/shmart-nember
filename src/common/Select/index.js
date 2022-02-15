import { Select } from "antd";
import React from "react";
import PropTypes from "prop-types";
const { Option } = Select;
export default function ISelect(props) {
  const { dataOption = [], keyName, valueName } = props;
  return (
    <Select {...props}>
      {dataOption.map((item) => (
        <Option value={item[valueName]} key={item[keyName]}>
          {item[valueName]}
        </Option>
      ))}
    </Select>
  );
}

ISelect.propTypes = {
  dataOption: PropTypes.array.isRequired,
  keyName: PropTypes.string.isRequired,
  valueName: PropTypes.string.isRequired,
};
