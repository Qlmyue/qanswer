---
title: "记一次JMX远程连接失败的问题"
slug: jvm-jmx
date: 2020-09-08 06:15:19
category: java
tags: [java, java, jvm]
status: published
views: 2700
---

今日测试服上发现了一个堆内存问题，想要用jvisualvm远程连接jmx过去查看，但是发现连接失败了。

![](https://www.freebytes.net/wp-content/uploads/2020/09/image.png)

我赶紧查看服务器上的jvm参数，参数正常——

```
-Djava.rmi.server.hostname=192.168.12.17 -Dcom.sun.management.jmxremote.port=18886 -Dcom.sun.management.jmxremote=true -Dcom.sun.management.jmxremote.ssl=false -Dcom.sun.managementote.ssl=false -Dcom.sun.management.jmxremote.authenticate=false
```

接着，我去查看了一下linux服务器上的端口开放状态，jmx用的18886端口是开放的，没问题。然后我又在本地telnet到服务器的18886端口，也没问题。这就奇怪了......

后来查了一下，才知道原来除了JMX server指定的监听端口号外，JMXserver还会监听一到两个随机端口号。那就得找出这两个端口号，再到防火墙开放端口了。

操作如下——

```
###找出服务所占用的pid
ps -ef|grep 服务名
###找出pid相关的监听端口
netstat -tupln |grep pid
```

![](https://www.freebytes.net/wp-content/uploads/2020/09/image-1.png)

图中，8091是我的服务端口，18886是jmx的端口，那么剩下两个就是随机监听端口了。

```
###开放防火墙端口
firewall-cmd --zone=public --add-port=32816/tcp --permanent
firewall-cmd --zone=public --add-port=43235/tcp --permanent
firewall-cmd --reload
```

如此，再重新连接jmx，发现可以正常访问了。