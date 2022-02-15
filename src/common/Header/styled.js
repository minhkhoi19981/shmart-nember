import styled from "styled-components";
import { Layout } from "antd";

const { Header } = Layout;

const HeaderWrapper = styled.div`
  height: 60px;
  display: flex;
  justify-content: flex-end;
  z-index: 99;
  background: #078762;
  position: fixed;
  width: 100%;
  padding: 0 25px;
`

const HeaderCustom = styled(Header)`
  padding: 0 24px 0px 0px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  line-height: 0px;
`;

export { HeaderWrapper, HeaderCustom };
