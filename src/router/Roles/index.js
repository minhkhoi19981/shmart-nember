import { lazy } from "react";

const pathRoles = {
  roles: "/roles",
};

const navigateRoles = [
  {
    name: "Roles",
    path: pathRoles.roles,
    component: lazy(() => import("../../page/Roles/ListRoles.js")),
  },
];

export default navigateRoles;
