import { lazy } from "react";

const pathRoles = {
  station: "/station",
};

const navigateStations = [
  {
    name: "Stations",
    path: pathRoles.station,
    component: lazy(() => import("../../page/Stations/ListStationsPage.js")),
  },
];

export default navigateStations;
