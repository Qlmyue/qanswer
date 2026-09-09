---
title: "kafka基本配置"
slug: kafka-base-config
date: 2021-08-09 14:50:37
category: java
tags: [java, java, kafka]
summary: "本文讲述kafka中配置文件的各种基本配置项。"
status: published
views: 1298
---

kafka的软件包目录如下：

![](https://www.freebytes.net/wp-content/uploads/2021/08/image-1.png)

配置文件在config目录下，其中server.properties是kafka的配置文件，zookeeper.properties是zookeeper的配置文件。

```
#######zookeeper.properties

####################zookeeper的数据目录，此处应为绝对路径
dataDir=D:/kafka-stutdy/zookeeper-data

####################zookeeper服务的端口
clientPort=2181
```

```
######server.properties

#broker实例id 这个是kafka集群区分每个节点的唯一标志符
broker.id=0

#服务地址 可以写成PLAINTEXT://localhost:9092  或者PLAINTEXT://你的域名:9092
#或者PLAINTEXT://你的ip:9092
#如果不是提供给本地项目使用，最好写你的ip或者域名 不要写localhost。
listeners=PLAINTEXT://:9092

#发送的数据包大小限制
socket.send.buffer.bytes=102400

#接收的数据包大小限制
socket.receive.buffer.bytes=102400

#一次请求能接受的最大数据包限制
socket.request.max.bytes=104857600

#数据的存放路径，最好是绝对路径
log.dirs=D:/kafka-stutdy/kafka-data

#分区数量，生产者默认会将消息平均发送到不同分区，一个分区就是一个topic的数据目录
num.partitions=1

#每个分区的副本数目，一个topic的数据目录=分区数*副本数
offsets.topic.replication.factor=1

#kafka消息的保留时间，默认为7天即168小时【单位为：小时】
log.retention.hours=168

#log文件存放着msg，这里设置的是log文件的最大大小，默认最大为1个G【单位为：byte】
log.segment.bytes=1073741824

#kafka连接的zookeeper地址
zookeeper.connect=localhost:2181

#kafka连接zookeeper的超时时间
zookeeper.connection.timeout.ms=18000
```