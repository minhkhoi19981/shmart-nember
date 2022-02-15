import { lazy } from "react";

const pathOrder = {
  order: "/order",
  detail_order: "/order/detail/:id",
  create_order: "/order/create",
};

const navigateOrder = [
  {
    name: "Order",
    path: pathOrder.order,
    component: lazy(() => import("../../page/Order/index.js")),
  },
  {
    name: "Order Detail",
    path: pathOrder.detail_order,
    component: lazy(() => import("../../page/Order/DetailOrder.js")),
  },
  {
    name: "CreateOrder",
    path: pathOrder.create_order,
    component: lazy(() => import("../../page/Order/CreateOrder.js")),
  },
];

export default navigateOrder;
