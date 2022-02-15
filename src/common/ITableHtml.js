import React, { useEffect } from "react";
export default function ITableHtml(props) {
  const {
    childrenHeader,
    childrenBody,
    isfoot = false,
    isBorder = true,
    childrenTitle,
    childrenFoot,
    styleTalbe,
    isNoClass = false,
    classStyled = "",
  } = props;

  // useEffect(() => {}, [props.childrenBody]);
  return (
    <div
      class={
        isNoClass
          ? `cursor-scroll ${classStyled}`
          : "tableFixHead cursor-scroll"
      }
    >
      <table
        style={{
          border: isBorder ? "1px solid rgba(122, 123, 123, 0.5)" : "unset",
          width: "100%",
          borderBottom: "none",
          ...styleTalbe,
        }}
      >
        <thead className="thead-table">{childrenTitle}</thead>
        <thead className="thead-table">{childrenHeader}</thead>
        <tbody style={{ height: 100, overflow: "hidden" }}>
          {childrenBody}
        </tbody>
        {isfoot ? childrenFoot : null}
      </table>
    </div>
  );
}
