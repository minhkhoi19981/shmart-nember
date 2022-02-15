import React from "react";
import { IStyledSearch } from "./styledSearch";
import { SearchOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { grey } from "@ant-design/colors";

const IDiv = styled.div`
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  cursor: pointer;

  :hover ${IStyledSearch} {
    width: 400px;

    transform: 0.2s;
    border-bottom: 1px solid #f5f5f5;
    background-color: "f5f5f5";
    padding: 2px;
  }

  .ant-input:focus {
    -webkit-box-shadow: 0 0 0 0 white !important;
  }
`;

function ISearch(props) {
  return (
    <div>
      <IDiv style={{ backgroundColor: grey[300], borderRadius: 20 }}>
        <SearchOutlined
          style={{
            fontSize: 16,
            padding: 12,
          }}
        />
        <IStyledSearch
          required
          {...props}
          onSearch={(value) => console.log(value)}
          enterButton
        />
      </IDiv>
    </div>
  );
}

export default ISearch;
