import { lazy } from "react";

const pathHome = {
  list_account: "/account",
  list_wallet: "/wallet",
};

const navigateAccount = [
  {
    name: "Danh sách tài khoản",
    path: pathHome.list_account,
    component: lazy(() => import("../../page/Account/ListAccount.js")),
  },
  {
    name: "Danh sách nạp ví",
    path: pathHome.list_wallet,
    component: lazy(() => import("../../page/Account/ListResquestWallet.js")),
  },
];

export default navigateAccount;
