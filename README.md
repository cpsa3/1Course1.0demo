##AngularJs Demo


##依赖说明
    1、启动项目前需安装nodejs

## 安装说明
    1、下载文件至本地
    2、跳转至该文件目中的scripts文件夹
    3、执行npm install
    4、执行npm start

## 测试说明
    1、使用karma + require
	2、test/test-main.js为测试模块的require config
	3、测试文件放在test/spec目录下，文件名以Spec.js结尾
	4、运行测试
        karma start

## 打包压缩
	1、使用r.js 
	2、打包策略：将angular主模块打包成单个js文件，第三方库不进行打包。
	3、不需要打包的第三方库需要在build.js中配置，配置参考[r.js sample build file](https://github.com/jrburke/r.js/blob/master/build/example.build.js)
	4、执行 node node_modules/requirejs/bin/r.js -o build.js 进行项目打包
	5、打包后文件在dist目录下