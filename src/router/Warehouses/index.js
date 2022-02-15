import { lazy } from "react";

const pathWareHouses = {
  warehouses: "/warehouses",
  warehouses_import: "/warehouses/import",
  warehouses_import_detail: "/warehouses/import/:id",
  warehouses_import_create: "/warehouses/import/:type/:id",
  warehouses_export: "/warehouses/export",
  warehouses_export_detail: "/warehouses/export/:id",
  warehouses_export_create: "/warehouses/export/:type/:id",
};

const navigateWareHouses = [
  {
    name: "Warehouses",
    path: pathWareHouses.warehouses,
    component: lazy(() => import("../../page/Warehouses/index.js")),
  },
  {
    name: "WarehousesInput",
    path: pathWareHouses.warehouses_import,
    component: lazy(() =>
      import("../../page/ImportWarehouses/ListImportWarehouses.js")
    ),
  },
  {
    name: "WarehousesInputDetail",
    path: pathWareHouses.warehouses_import_detail,
    component: lazy(() =>
      import("../../page/ImportWarehouses/DetailImportWarehouses.js")
    ),
  },
  {
    name: "WarehousesInputCreate_Update",
    path: pathWareHouses.warehouses_import_create,
    component: lazy(() =>
      import("../../page/ImportWarehouses/CreateImportWarehouses.js")
    ),
  },
  {
    name: "WarehousesExport",
    path: pathWareHouses.warehouses_export,
    component: lazy(() =>
      import("../../page/ExportWarehouses/ListExportWarehouses.js")
    ),
  },
  {
    name: "WarehousesExportDetail",
    path: pathWareHouses.warehouses_export_detail,
    component: lazy(() =>
      import("../../page/ExportWarehouses/DetailExportWarehouses.js")
    ),
  },
  {
    name: "WarehousesExportCreate_Update",
    path: pathWareHouses.warehouses_export_create,
    component: lazy(() =>
      import("../../page/ExportWarehouses/CreateExportWarehouses.js")
    ),
  },
];

export default navigateWareHouses;
