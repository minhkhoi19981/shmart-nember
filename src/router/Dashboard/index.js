import { lazy } from "react";

const pathDashboard = {
  dashboard_page: "/dashboard",
};

const navigateDashboard = [
  {
    name: "Bảng Điều Khiển",
    path: pathDashboard.dashboard_page,
    component: lazy(() => import("../../page/Dashboard/index.js")),
  },
];

export default navigateDashboard;
