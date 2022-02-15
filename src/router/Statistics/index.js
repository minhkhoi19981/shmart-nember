import { lazy } from "react";

const pathStatistics = {
  statistics_page: "/statistics",
};

const navigateStatistics = [
  {
    name: "Thống Kê",
    path: pathStatistics.statistics_page,
    component: lazy(() => import("../../page/Statistics/index.js")),
  },
];

export default navigateStatistics;
