import { lazy } from "react";

const pathCode = {
  code: "/code",
  //   detail_order: "/order/detail/:id",
};

const navigateCode = [
  {
    name: "Code",
    path: pathCode.code,
    component: lazy(() => import("../../page/Code/ListCode.js")),
  },
  //   {
  //     name: "Order Detail",
  //     path: pathOrder.detail_order,
  //     component: lazy(() => import("../../page/Order/DetailOrder.js")),
  //   },
];

export default navigateCode;
