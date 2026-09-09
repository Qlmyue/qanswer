---
title: "远程debug线上springboot项目"
slug: springboot-debug-remote
date: 2019-10-08 07:35:31
category: java
tags: [java, java, springboot]
summary: "当项目打包放到线上之后，通常会出现一些在本地上不会出现的问题，这时候如果在本地的调试没有办法解决问题的话，不妨考虑一下使用线上debug调试。线上的代码是个jar包，linux环境，没有idea、eclipse等开发工具，如何进行debug调试呢？这就要用到idea的神奇功能了。"
status: published
views: 2250
---

当项目打包放到线上之后，通常会出现一些在本地上不会出现的问题，这时候如果在本地的调试没有办法解决问题的话，不妨考虑一下使用线上debug调试。线上的代码是个jar包，linux环境，没有idea、eclipse等开发工具，如何进行debug调试呢？这就要用到idea的神奇功能了。

前提：使用springboot项目，本地项目与线上项目代码一致。

第一步：打开idea，打开本地项目，编辑启动项——

[

![](https://www.freebytes.net/wp-content/uploads/2019/10/image.png)

]()

[

![](https://www.freebytes.net/wp-content/uploads/2019/10/image-1.png)

]()

[

![](https://www.freebytes.net/wp-content/uploads/2019/10/image-2.png)

]()

如上图，添加一个远程连接，host写你的线上地址，端口选择默认的就好，这个端口号是用来与线上项目通讯，使得本地idea能够监听线上代码执行到哪一步、并在遇到断点时就把暂停执行的指令发到线上jvm。真正的springboot项目启动端口，还是在application.properties文件中配置。

第二步：将本地项目打包成picture.jar，放到线上，并在执行指令中加上一段文本

agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005   

也就是从上图中复制下来的文本。

你可以这样子来启动jar包

java  -jar -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005   picture.jar 

第三步：这时候线上项目已经跑起来了，回到idea中，点击下图的debug虫子启动，然后只要在代码中打上断点就使用远程debug调试了。不过日志输出依然是在远程窗口才能看到。

[

![](https://www.freebytes.net/wp-content/uploads/2019/10/image-3.png)

]()