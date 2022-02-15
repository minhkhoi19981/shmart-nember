import { svgs } from "../assets";

const _menuDynamic = [
  {
    value: "Tổng Quan",
    permission: ["admin", "super_admin"],
    path: "/dashboard",
    children: [],
    name: svgs.IconBookShelf,
    subMenu: 0,
  },
  {
    value: "Tổng Quan",
    permission: ["admin", "super_admin"],
    path: "/dashboard",
    children: [],
    name: svgs.IconBookShelf,
    subMenu: 1,
  },
  {
    value: "Tài khoản",
    permission: ["admin", "super_admin"],
    children: [
      {
        value: "Danh sách",
        path: "/account",
        index: 0,
        subMenu: 2,
      },
      {
        value: "Phân quyền",
        path: "/roles",
        index: 1,
        subMenu: 2,
      },
      {
        value: "Danh sách nạp ví",
        path: "/wallet",
        index: 2,
        subMenu: 2,
      },
    ],
    name: svgs.IconAccount,
    subMenu: 2,
  },

  {
    value: "Đơn Hàng",
    permission: ["admin", "super_admin"],
    path: "/order",
    children: [],
    name: svgs.IconCart,
    subMenu: 3,
  },

  // {
  //   value: "Chiến Dịch",
  //   permission: ["admin", "super_admin"],
  //   path: "/code",
  //   children: [],
  //   name: svgs.IconBriefcase,
  //   subMenu: 3,
  // },

  {
    value: "Mã Giảm Giá",
    permission: ["admin", "super_admin"],
    path: "/voucher",
    children: [],
    name: svgs.IconBriefcase,
    subMenu: 4,
  },

  {
    value: "Cửa Hàng",
    permission: ["admin", "super_admin"],
    path: "/station",
    children: [],
    name: svgs.IconSHPoint,
    subMenu: 5,
  },
  {
    value: "Sản phẩm",
    permission: ["admin", "super_admin"],
    path: "/product",
    children: [
      {
        value: "DS Danh Mục",
        path: "/cate",
        index: 0,
        subMenu: 6,
      },
      {
        value: "DS Sản phẩm",
        path: "/product",
        index: 1,
        subMenu: 6,
      },
      {
        value: "Sản phẩm mobile",
        path: "/product/mobile",
        index: 2,
        subMenu: 6,
      },
    ],
    name: svgs.IconProduct,
    subMenu: 6,
  },

  {
    value: "Đối Tác Liên Kết",
    permission: ["admin", "super_admin"],
    path: "/warehouses",
    children: [],
    name: svgs.IconStations,
    subMenu: 7,
  },
  {
    value: "Tin tức",
    permission: ["admin", "super_admin"],
    path: "/new",
    children: [],
    name: svgs.IconSHPoint,
    subMenu: 8,
  },

  // {
  //   value: "Kho Hàng",
  //   permission: ["admin", "super_admin"],
  //   path: "/",
  //   children: [
  //     {
  //       value: "NHẬP HÀNG",
  //       path: "/warehouses/import",
  //       index: 1,
  //       subMenu: 8,
  //     },
  //     {
  //       value: "XUẤT / TRẢ HÀNG",
  //       path: "/warehouses/export",
  //       index: 2,
  //       subMenu: 8,
  //     },
  //   ],
  //   name: svgs.IconWarehouse,
  //   subMenu: 8,
  // },
];

export default _menuDynamic;
