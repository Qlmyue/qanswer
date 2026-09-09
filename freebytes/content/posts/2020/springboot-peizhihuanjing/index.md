---
title: "SpringBoot配置文件的继承性和覆写性"
slug: springboot-peizhihuanjing
date: 2020-08-18 07:22:21
category: java
tags: [java, java, spring, springboot]
status: published
views: 3634
---

项目运行环境有三种，开发环境、测试环境、生成环境，在springboot项目中对应着三个配置文件，application.properites，application-dev.properites， application-prod.properites。

在部署时，用命令运行springboot的jar包，只需要加上一句配置，就能切换测试和生产环境：

```
###测试环境
--spring.profiles.active=dev
###生产环境
--spring.profiles.active=prod
```

不考虑将配置文件存放到jar包外部的情况，只讨论在jar包内部，即在resources目录下的情况——
配置--spring.profiles.active=dev，其实是指定同时使用 application.properites和application-dev.properites两个配置文件； 
配置--spring.profiles.active=prod，其实是指定同时使用 application.properites和application-prod.properites两个配置文件。

application-dev.properites和 application-prod.properites会继承于 application.properites文件中的配置，并可以覆写其中配置。举例——

```
###########在application.properites文件中配置#########
server.port=8080
location=D:/temp

###########在application-dev.properites文件中配置#########
location=D:/dev/temp

###########在application-prod.properites文件中配置#########
server.port=80
location=/root/project/temp
```

这样一个项目，在开发环境时， server.port的值为8080 ，location的值为D:/temp。

切换到dev环境时， 没有配置server.port，所以server.port的值继承为8080 ， location的值重写为D:/dev/temp。

切换到prod环境时，重写server.port值为80，重写location值为/root/project/temp。