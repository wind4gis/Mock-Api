# 初始化
将该文件放在根目录的config文件夹下，与webpack设置的文件同级。把对应的mock数据放在根目录的mock文件夹下。

需要设置两个process.env变量，一个是MOCK一个是PROXY。这里是通过env-cmd来设置变量，也可以通过cross-env或者dot-env。MOCK是用于打开该配置，PROXY是用于将请求先转发至本地webpack-dev-server。

在webpack-dev-server的配置里，将该中间件覆盖对应的before配置即可。

# 原理
通过重写webpack-dev-server的before配置，捕获对应的url请求，判断对应的请求参数是否相同，如果相同就返回mock数据
