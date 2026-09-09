---
title: "看了两周的tomcat源码"
slug: tomcat-server-research
date: 2021-01-27 03:23:32
category: java
tags: [java, java, tomcat, 寥寥随笔, 随笔]
summary: "探寻源码是一个很让人兴致盎然的过程，因为在探寻的过程中会不断地获得小惊喜。"
status: published
views: 2525
---

一连看了两周的tomcat的源码，搞清楚了很多问题，解开了多年的疑惑，感觉心神愉悦。

初看源码时，如巍峨高山，望而却步。全然不知从何下手，所幸找到了一些优秀的博文，便开始从源头处着手，一步一步地攀爬。

期间受到了大神的指点，结合着《深入剖析tomcat》这本优秀的书，继续深入探索，最终才将所有模块、架构、设计思想一一搞清楚，看清了各种组件、容器、监听器、阀的大概源码，明白了一次http请求所经过的所有处理类，明白了tomcat是如何与应用程序的servlet交互的，也明白了tomcat是如何与应用程序的listener交互的......

看源码真的是需要长久的细心、耐心，过程中需要翻阅很多的资料，调试很多次，做很多的笔记，尝试很多的推测分析，但也是一个很让人兴致盎然的过程，因为在探寻的过程中会不断地获得小惊喜。在此感激曾给予我帮助的优秀博文和书籍：

```
https://www.lixiang.red/tags/tomcat
https://www.cnblogs.com/alimayun/p/10604532.html
https://blog.csdn.net/qq_35246620/article/details/77585306?utm_source=tuicool&utm_medium=referral

《深入剖析Tomcat》
```