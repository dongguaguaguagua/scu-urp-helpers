# scu-urp-helpers
用于四川大学教务系统的简单脚本，属于Tampermonkey插件，安装方法略

## [成绩详情脚本](./scu-urp-scorehelper.user.js)
* 修复本学期成绩查询的错误显示
* 在全部学期查询中加入跳转到本学期的链接

## [隐私保护脚本](./scu-urp-privacyholder.user.js)
* 隐藏真实姓名和照片以便截图
* 点击头像旁的日历切换模式
* 可在`个人管理`>`个人信息修改`>`隐私保护插件设置`中改变显示效果

## [登录有效14天脚本](./scu-urp-loginfor14d.user.js)
* 在登录页面加回被注释的“两周内无需登录”选项

## [评教分数详情脚本](./scu-urp-queryTeachEvaluationScores.user.js)
* 在`教师课堂评价`>`学生评教`>`教学评估`>`期末评教`中加入查看所有该教师评分的功能
* **注意：**本功能是查询学生评教分数，不是教师给分，可作为评教前的参考
* 该功能依赖教务系统错误返回全部信息的bug运行，一旦该bug修复，该功能将失效

## Disclaimer 
该项目所有脚本均只涉及前端显示修改，不会向任何服务器（包括教务系统本身和/或第三方服务器）进行任何形式的数据上载，只会在特定功能向教务系统本身请求额外数据，所有插件设置数据不会离开使用者计算机本地，所有页面数据不会离开教务系统站点处理。
