---
title: "轻量级实现SpringBoot实时更新配置文件"
slug: spring-boot-qingliang-peizhi-gengxin
date: 2022-07-05 13:06:43
category: java
tags: [java, java, springboot]
status: published
views: 2320
---

SpringBoot框架默认不支持配置文件application.properties的实时修改，一旦修改了配置文件，必须重启项目。

解决方案当然也有很多，比如引入SpringCloud的相关组件，比如使用nacos，但是我觉得这太过麻烦了，于是想了一个轻量级的实现方案。

大体的思路是，在项目中额外开一个线程，检测配置文件的变化，实时获取到最新的值，再将值实时写回到对应的变量。但是对应的变量必须是static修饰的，这样才能作用到全局，这也是它的一个局限性吧。

方案的实现代码在gitee上，除了springboot，不需要引入其他任何组件。
[https://gitee.com/freebytes/boot-config-refresh]()

将项目pull下来，直接运行跑起来。可以在idea上直接运行，也可以打包成jar，再运行。运行之后，浏览器输入http://localhost:8080/test，就可以看到application.properties配置的值，此时修改一下其中某个值，再刷新浏览器，会看到变化。

[

![](https://www.freebytes.net/wp-content/uploads/2022/07/image.png)

]()idea中的配置文件

[

![](https://www.freebytes.net/wp-content/uploads/2022/07/image-1.png)

]()jar包中的配置文件

无论jar包部署，还是idea运行，都可以实时修改配置文件的值。如果jar包的同级目录下没有配置文件，程序还会自动将jar包内部的配置文件复制出来，便于随时更改。