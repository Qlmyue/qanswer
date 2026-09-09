---
title: "kafka简单集群部署配置"
slug: kafka-server-multi-config
date: 2022-01-13 08:51:59
category: java
tags: [java, java, kafka]
status: published
views: 1438
---

由于服务器资源限制，我只能在单机上模拟部署kafka集群，跟在多服务器情况下部署，其实没啥差别，只是在单机上各个服务的端口号必须不一样而已。

[

![](https://www.freebytes.net/wp-content/uploads/2021/08/image-13.png)

]()

如图，我准备了两个kafka服务器，1个zookeeper服务器，用这些部署一个集群。先看配置：

```
###kafka-1的配置 server.properties

broker.id=1
listeners=PLAINTEXT://192.168.50.13:9092
log.dirs=D:/kafka-cluster/kafka/kafka-data
zookeeper.connect=192.168.50.13:2181

###kafka-2的配置 server.properties
broker.id=2
listeners=PLAINTEXT://192.168.50.14:9092
log.dirs=D:/kafka-cluster/kafka/kafka-data
zookeeper.connect=192.168.50.13:2181

###zookeeper-1的配置
dataDir=D:/kafka-cluster/zookeeper/zookeeper-data
clientPort=2181
```

然后，先启动zookeeper，再启动两个kafka。

在其中一个kafka上创建一个topic：

```
kafka/bin/windows/kafka-topics.bat --create --bootstrap-server 192.168.50.13:9092  --replication-factor 1 --partitions 2 --topic test-1
```

可以发现，两个kafka的服务器上的日志目录，分别多出一个test-1的数据目录。

执行命令查看两个kafka服务器的topic列表：

```
kafka/bin/windows/kafka-topics.bat --list --bootstrap-server 192.168.50.13:9092

kafka/bin/windows/kafka-topics.bat --list --bootstrap-server 192.168.50.14:9092
```

发现同时存在test-1的topic，则集群配置成功了。

如果想要配置多个zookeeper，则将zookeeper.connect=192.168.50.13:2181的配置改为多个ip即可，用逗号隔开，如：

```
zookeeper.connect=192.168.50.13:2181,192.168.50.14:2181
```