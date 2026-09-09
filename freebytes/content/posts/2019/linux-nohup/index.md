---
title: "Linux运行jar包指令 nohup与&"
slug: linux-nohup
date: 2019-12-11 09:11:43
category: java
summary: "nohup的作用是， 在执行指令后 ，即时关闭当前与linux服务器连接的客户端，运行的jar包服务也不会中断。&的作用是，在执行指令后..."
status: published
views: 1634
---

通常我们在linux上运行一个可执行jar包，所需要的简洁指令如下：

```
nohup java -Dfile.encoding=utf-8 -jar freebyte.jar &
```

nohup的作用是， 在执行指令后 ，即时关闭当前与linux服务器连接的客户端，运行的jar包服务也不会中断。

&的作用是，在执行指令后，即时按下ctrl+c，也不会中断 jar包服务 。