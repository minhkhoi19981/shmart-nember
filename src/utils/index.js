import colors from "./color/index";
import images from "./images/index";
import useWindowSize from "./useWindowSize";

const priceFormat = (price) => {
  if (price == undefined) {
    return "";
  } else {
    let str = typeof price == "string" ? price : price.toString();
    return str.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "";
  }
};

const readGroup = (group) => {
  const readDigit = [
    " Không",
    " Một",
    " Hai",
    " Ba",
    " Bốn",
    " Năm",
    " Sáu",
    " Bảy",
    " Tám",
    " Chín",
  ];
  let temp = "";
  if (group == "000") return "";
  //read number hundreds
  temp = readDigit[group.substring(0, 1)] + " Trăm";
  //read number tens
  if (group.substring(1, 2).equals("0"))
    if (group.substring(2, 3).equals("0")) return temp;
    else {
      temp += " Lẻ" + readDigit[group.substring(2, 3)];
      return temp;
    }
  else temp += readDigit[group.substring(1, 2)] + " Mươi";
  //read number
  if (group.substring(2, 3) == "5") temp += " Lăm";
  else if (group.substring(2, 3) != "0")
    temp += readDigit[group.substring(2, 3)];
  return temp;
};
const readMoney = (num) => {
  if (num == null || num.equals("")) return "";
  let temp = "";
  //length <= 18
  while (num.length() < 18) {
    num = "0" + num;
  }
  let g1 = num.substring(0, 3);
  let g2 = num.substring(3, 6);
  let g3 = num.substring(6, 9);
  let g4 = num.substring(9, 12);
  let g5 = num.substring(12, 15);
  let g6 = num.substring(15, 18);
  //read group1 ---------------------
  if (!g1.equals("000")) {
    temp = readGroup(g1);
    temp += " Triệu";
  }
  //read group2-----------------------
  if (!g2.equals("000")) {
    temp += readGroup(g2);
    temp += " Nghìn";
  }
  //read group3 ---------------------
  if (!g3.equals("000")) {
    temp += readGroup(g3);
    temp += " Tỷ";
  } else if (!"".equals(temp)) {
    temp += " Tỷ";
  }

  //read group2-----------------------
  if (!g4.equals("000")) {
    temp += readGroup(g4);
    temp += " Triệu";
  }
  //---------------------------------
  if (!g5.equals("000")) {
    temp += readGroup(g5);
    temp += " Nghìn";
  }
  //-----------------------------------
  temp = temp + readGroup(g6);
  //---------------------------------
  // Refine
  temp = temp.replaceAll("Một Mươi", "Mười");
  temp = temp.trim();
  temp = temp.replaceAll("Không Trăm", "");
  //        if (temp.indexOf("Không Trăm") == 0) temp = temp.substring(10);
  temp = temp.trim();
  temp = temp.replaceAll("Mười Không", "Mười");
  temp = temp.trim();
  temp = temp.replaceAll("Mươi Không", "Mươi");
  temp = temp.trim();
  if (temp.indexOf("Lẻ") == 0) temp = temp.substring(2);
  temp = temp.trim();
  temp = temp.replaceAll("Mươi Một", "Mươi Mốt");
  temp = temp.trim();

  //Change Case
  return (
    "(" +
    temp.substring(0, 1).toUpperCase() +
    temp.substring(1).toLowerCase() +
    " đồng chẵn./.)"
  );
};

export { priceFormat, colors, images, useWindowSize, readGroup };
