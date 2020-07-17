/*
 * @Date: 2020-04-08 11:27:38
 * @LastEditors: Huang canfeng
 * @LastEditTime: 2020-04-08 11:28:13
 * @Description: 
 */
module.exports = () => {
  return {
		output: {
			publicPath: "/",
			filename: "statics/js/[name].[chunkhash:8].js",
			chunkFilename: "statics/js/[id].[chunkhash:8].chunk.js",
		},
	};
}