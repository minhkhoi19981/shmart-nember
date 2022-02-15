const { default: styled } = require("styled-components");
const { Input } = require("antd");
const IStyledSearch = styled(Input)`
  border: none;
  height: 42px;
  width: 0px;
  padding: 0px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  :focus {
    width: 400px;
    transform: 0.4s;
    border-bottom: 1px solid #f5f5f5;
    background: "f5f5f5";
    padding: 2px;
  }

  :valid {
    width: 400px;
    transform: 0.4s;
    border-bottom: 1px solid #f5f5f5;
    background: "f5f5f5";
    padding: 2px;
  }
`;
export { IStyledSearch };
