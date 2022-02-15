import { lazy } from "react";

const pathReport = {
  report: "/report",
};

const navigateReport = [
  {
    name: "Report",
    path: pathReport.report,
    component: lazy(() => import("../../page/Report/ListReport.js")),
  },
];

export default navigateReport;
