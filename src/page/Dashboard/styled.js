import styled from "styled-components";

const ContainerTop = styled.div`
    width: 100%;
    display: flex;
`

const Container = styled.div`
    width: 100%;
    display: flex;
    border-bottom: 1px solid #e4dddd;
    padding: 60px 0;
`

const TotalUsers = styled.div`
    padding: 40px;
    margin: 10px 50px 0 10px;
    background: #68b368;
    border-radius: 5px;
    color: white;
    font-weight: bold;
    text-transform: uppercase;

    p {
        font-size: 50px;
        position: relative;
    }
`

const TotalOrders = styled.div`
    padding: 40px;
    margin: 10px 50px 0 10px;
    background: #85a5af;
    border-radius: 5px;
    color: white;
    font-weight: bold;
    text-transform: uppercase;

    p {
        font-size: 50px;
        position: relative;
    }
`

const TotalRevenues = styled.div`
    padding: 40px;
    margin: 10px 50px 0 10px;
    background: #bccc37;
    border-radius: 5px;
    color: white;
    font-weight: bold;
    text-transform: uppercase;

    p {
        font-size: 50px;
        position: relative;
    }
`

const TotalProfit = styled.div`
    padding: 40px;
    margin: 10px 50px 0 10px;
    background: #fbaa30;
    border-radius: 5px;
    color: white;
    font-weight: bold;
    text-transform: uppercase;

    p {
        font-size: 50px;
        position: relative;
    }
`

const TableTitle = styled.p`
    position: absolute;
    margin-top: 0px;
    margin-bottom: 100px;
    width: 100%;
    text-align: center;
    font-weight: bold;
    font-size: 15px;

    text-transform: uppercase;
`

const ColumnFirst = styled.div`
    display: inline-grid;
    width: 900px;
`

const ColumnSecond = styled.div`
    display: inline-grid;
    width: 550px;

    border: 1px solid #389e0d;
    padding: 15px;
    border-radius: 8px;
`

const TableRowFlexTitle = styled.p`
    position: absolute;
    margin-top: 0px;
    text-align: center;
    font-weight: bold;
    font-size: 18px;
    text-transform: uppercase;
`

const RowFlex = styled.div`
    display: inline-grid;
    width: 100%;

    border: 2px solid #389e0d;
    padding: 20px 10px;
    border-radius: 8px;
`
const LegendChart = styled.div`
    display: flex;
    text-align: center;
    margin: 0 auto;

    text-transform: uppercase;
`

export { 
    ContainerTop,
    Container,
    TotalUsers, TotalOrders, TotalRevenues, TotalProfit,
    TableTitle,
    ColumnFirst,
    ColumnSecond,
    TableRowFlexTitle,
    RowFlex,
    LegendChart
 }