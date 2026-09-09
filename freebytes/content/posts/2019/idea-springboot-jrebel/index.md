---
title: "idea+springboot+JRebel 实现热部署"
slug: idea-springboot-jrebel
date: 2019-09-03 01:38:24
category: java
tags: [java, java, springboot]
status: published
views: 1698
---

项目实现热部署的好处:

1. update代码（不改变配置文件和外部引用时）不用重启
2. 改变类的结构(增加属性、增加/修改/删除/编辑方法、注入对象等)不用重启
3. 增加/删除类文件不用重启

spring boot实现热部署的方式有两种：

1.通过再项目中加入如下的依赖 然后再application.properties中加入

  spring.devtools.restart.additional-paths=src/main/java(热部署的包目录)

在pom文件中加入依赖

```
<dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-devtools</artifactId>
        <optional>true</optional>
        <!-- optional=true,依赖不会传递，该项目依赖devtools；
之后依赖myboot项目的项目如果想要使用devtools，需要重新引入 -->
</dependency>
<dependency>
       <groupId>org.springframework</groupId>                   
       <artifactId>springloaded</artifactId>
       <version>1.2.6.RELEASE</version>
</dependency>
```

这种方式相对简单,但是并不适用于多样化的项目结构  , 推荐使用第二种.

2.安装jrebel插件 (jrebel可满足多样化项目结构,多种框架的热部署需求)

[

![](https://static.oschina.net/uploads/space/2017/1205/152220_RN3w_3490860.png)

]()

[

![](https://static.oschina.net/uploads/space/2017/1205/152231_cYyH_3490860.png)

]()

jrebel并不是一个免费的开源插件,可以通过破解的方式或者注册Facebook账号的方式申请获得免费的激活码

(破解方式没有教程,网上教程都试过 但是失败了)

申请激活码教程(需要翻墙)——

[点击这里]() [https://my.jrebel.com/account/how-to-activate ]()

注册或者使用facebook账号登陆，皆可，然后在 

[

![](https://static.oschina.net/uploads/space/2017/1205/152348_SgvH_3490860.png)

]()

获取激活码。 

再照下图进行激活就可以了 

[

![](https://static.oschina.net/uploads/space/2017/1205/152357_TgOX_3490860.png)

]()

使用方法:

进入jrebel设置

[

![](https://static.oschina.net/uploads/space/2017/1205/152421_N9Ws_3490860.png)

]()

[

![](https://static.oschina.net/uploads/space/2017/1205/152428_bQWp_3490860.png)

]()

[

![](https://static.oschina.net/uploads/space/2017/1205/152440_2QMq_3490860.png)

]()

之后  编辑代码之后直接快捷键ctrl+f9重构项目就可以了 重构的过程很快 不用重启项目

示范效果:

[

![](https://static.oschina.net/uploads/space/2017/1205/152511_w4Fv_3490860.png)

]()

按下ctrl+f9  如下指示代表重新编译完成  新增的接口可以直接使用

[

![](https://static.oschina.net/uploads/space/2017/1205/152520_nbp3_3490860.png)

]()

[

![](https://static.oschina.net/uploads/space/2017/1205/152526_Mq9z_3490860.png)

]()