---
title: "kafka和zookeeper快捷启动"
slug: kafka-zookeeper-start-speed
date: 2021-08-07 14:00:33
category: java
tags: [java, java, kafka, zookeeper]
summary: "本文介绍下稍微整合过的kafka和zookeeper软件，在windows下，可以一键式便捷启动kafka、zookeeper、生产者与消费服务，方便学习研究使用。"
status: published
views: 1338
---

本文介绍下我自己稍微整合过的kafka和zookeeper软件，在windows下，可以一键式便捷启动kafka、zookeeper、生产者与消费服务，方便学习研究使用。

软件下载地址：

```
链接：https://pan.baidu.com/s/15YfcMsVGW2U8m44c11ZJfg 
提取码：9370
```

大家都知道，使用kafka需要用zookeeper作为支持。在官方下载kafka的时候，其实下载的文件中已经包含了zookeeper的软件，与kafka一同放在了软件包的bin目录中。

我针对kafka_2.13-2.8.0版本的软件包，做了一下快捷启动的配置和工具，如下图

[

![](https://www.freebytes.net/wp-content/uploads/2021/08/image.png)

]()

所有程序，zookeeper、kafka、生产者、消费者，均可以直接双击启动，当然是针对windows系统的，仅方便大家学习使用。

config目录下的server.properties是配置kafka的，zookeeper.properties是配置zookeeper的。我分别将两者的数据文件存储目录配置为与bin同级目录的kafka-data、zookeeper-data。