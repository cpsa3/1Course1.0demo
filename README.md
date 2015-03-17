##AngularJs Demo


##依赖说明
* 启动项目前需安装nodejs

## 安装说明
* 下载文件至本地
* 跳转至该文件目中的scripts文件夹
* 执行`npm install`
* 执行`npm start`

## 测试说明
* 使用karma + require
* test/test-main.js为测试模块的require config
* 测试文件放在test/spec目录下，文件名以Spec.js结尾
* 运行测试 `karma start`

## 打包压缩
* 使用r.js 
* 打包策略：将angular主模块打包成单个js文件，第三方库不进行打包。
* 不需要打包的第三方库需要在build.js中配置，配置参考[r.js-sample-build-file](https://github.com/jrburke/r.js/blob/master/build/example.build.js)
* 执行 `node node_modules/requirejs/bin/r.js -o build.js` 进行项目打包
* 打包后文件在dist目录下

## grunt命令
* `grunt dev` :启动站点，并开启livereload监听页面变化 
* `grunt release` :打包压缩js代码 
