/*
 * @Date: 2020-04-06 15:34:04
 * @LastEditors: Huang canfeng
 * @LastEditTime: 2020-04-07 20:22:05
 * @Description: 匹配api路径和对应的mock结果
 */
module.exports = [
  {
    url: `/api/refund/app/search/listRefund`,
    queryTxt: "pageSize=5&currentPage=1&sourceType=4",
    response: "./result/mock.json",
  },
  {
    url: `/api/refund/app/flow/refundCreateView`,
    queryTxt: "orderSn=B2003131606101258048186J5&uid=o5e6b3ef2f70dee000163bf11&sourceType=4",
    response: "./result/request.json",
    method: "post"
  },
]