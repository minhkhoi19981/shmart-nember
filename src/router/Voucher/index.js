import { lazy } from "react";

const pathVoucher = {
  voucher: "/voucher"
};

const navigateVoucher = [
  {
    name: "Voucher",
    path: pathVoucher.voucher,
    component: lazy(() => import("../../page/Voucher/ListVoucher.js")),
  }
];

export default navigateVoucher;
