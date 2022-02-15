import React from "react";

function ISvg(props) {
  const { SVG, width, height, fill = "white" } = props;
  return <SVG width={width} height={height} fill={fill}></SVG>;
}

export default ISvg;
