import { lazy } from "react";

const pathProduct = {
  product: "/product",
  cate: "/cate",
  new: "/new",
  product_mobile: "/product/mobile",
};

const navigateVoucher = [
  {
    name: "Product",
    path: pathProduct.product,
    component: lazy(() => import("../../page/Product/ListProduct.js")),
  },
  {
    name: "Cate",
    path: pathProduct.cate,
    component: lazy(() => import("../../page/Cate/index.js")),
  },
  {
    name: "News",
    path: pathProduct.new,
    component: lazy(() => import("../../page/New/ListNew.js")),
  },
  {
    name: "Product_mobile",
    path: pathProduct.product_mobile,
    component: lazy(() => import("../../page/Product/ListProductMobile.js")),
  },
];

export default navigateVoucher;
