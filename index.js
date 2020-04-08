/*
 * @Date: 2020-04-06 15:33:09
 * @LastEditors: Huang canfeng
 * @LastEditTime: 2020-04-08 11:23:31
 * @Description: 根据mock文件夹的配置文件，进行api接口的本地mock
 */
const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");
const clearModule = require("clear-module");
const qs = require("qs");
const _ = require("lodash");
const bodyParser = require("body-parser");

let mockList = null,
  mockPath = "";

if (fs.existsSync((mockPath = path.resolve("mock", "index.js")))) {
  try {
    mockList = require(mockPath);
  } catch (error) {
    mockList = null;
  }
}

module.exports = app => {
  // 根据全局的MOCK参数决定是否开启
  if (!mockList || !process.env.MOCK) {
    return (req, res, next) => {
      next();
    };
  }

  let responseList = {};
  const normalizeRespPath = resp =>
    require.resolve(resp, {
      paths: [path.join(__dirname, "..", "mock")]
    });

  for (let m of mockList) {
    // 初始化赋值
    const curPath = normalizeRespPath(m.response);
    const item = require(curPath);
    responseList[curPath] = item.default || item;
    m.query = m.query || qs.parse(m.queryTxt);
    m.method = String.prototype.toUpperCase.call(m.method || "get");
  }
  // mock内容热更新
  chokidar
    .watch(mockList.map(m => normalizeRespPath(m.response)))
    .on("change", (respPath, stats) => {
      clearModule(respPath);
      responseList[respPath] = require(respPath).default || require(respPath);
    });

  mockList.forEach(m => {
    // 动态匹配url、query和method
    app.use(m.url, (req, res, next) => {
      if (!_.isEqual(req.method, m.method)) {
        return next();
      }
      if (m.method === "GET") {
        if (_.isEqual(req.query, m.query)) {
          res.json(responseList[normalizeRespPath(m.response)]);
        }
      }
      if (m.method === "POST") {
        // POST请求需要根据Content-Type决定解析是方式
        let curParser = bodyParser.json();
        if (req.headers["content-type"].includes("x-www-form-urlencoded")) {
          curParser = bodyParser.urlencoded();
        }
        curParser(req, res, err => {
          if (err) {
            res.statusCode = err.status || 500;
            res.end(err);
          } else {
            if (_.isEqual(req.body, m.query)) {
              console.log(responseList[normalizeRespPath(m.response)], m.url);
              
              res.json(responseList[normalizeRespPath(m.response)])
            }
          }
        });
      }
      next();
    });
  });

  return (req, res, next) => {
    next();
  };
};
