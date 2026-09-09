---
title: "kafka基本指令"
slug: kafka-base-cmd
date: 2021-08-04 16:05:43
category: java
tags: [java, java, kafka]
summary: "主要介绍kafka的基本指令，运行zookeeper、kafka、启动消费者生产者等。"
status: published
views: 1266
---

1、启动zookeeper ，进入zookeeper的安装目录bin文件夹 ，直接双击运行zkServer.cmd（win系统）。

```
（Linux系统） bin/zookeeper-server-start.sh config/zookeeper.properties 
```

2、进入kafka安装目录，执行 

```
.\bin\windows\kafka-server-start.bat .\config\server.properties
```

3、查看所有topic

```
.\bin\windows\kafka-topics.bat --list  --bootstrap-server 127.0.0.1:9092 
```

4、创建topic

```
.\bin\windows\kafka-topics.bat --create --bootstrap-server  127.0.0.1:9092 --replication-factor 1 --partitions 1 --topic topic-1
```

5、启动生产者

```
.\bin\windows\kafka-console-producer.bat --broker-list  127.0.0.1:9092 --topic topic-1
```

6、启动消费者

```
.\bin\windows\kafka-console-consumer.bat --bootstrap-server  127.0.0.1:9092 --topic topic-1 --from-beginning
```

7、删除topic

```
.\bin\windows\kafka-topics.bat --bootstrap-server  127.0.0.1:9092 --delete --topic topic-1
```