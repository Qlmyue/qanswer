---
title: "ElasticSearch的基本配置"
slug: elasticsearch-base-config
date: 2021-12-14 09:55:15
category: java
tags: [elasitcSearch, java, java]
summary: "本文简单介绍下ElasticSearch的常用基本配置。"
status: published
views: 1368
---

本文简单介绍下ElasticSearch的常用基本配置。

从官网下载的es，我这里的版本是7.15.2，目录如下：

[

![](https://www.freebytes.net/wp-content/uploads/2021/12/image-1.png)

]()

bin目录中是执行脚本，config是配置文件目录，data是es的数据存储目录，jdk是es自带的jdk目录。

ElasticSearch启动时默认使用环境变量ES_JAVA_HOME，这个环境变量的值理应配置为es的jdk目录，如：

[

![](https://www.freebytes.net/wp-content/uploads/2021/12/image.png)

]()

如果你不配置这个环境变量，那么就会使用JAVA_HOME的值，也就是本机的jdk。如果使用ES_JAVA_HOME，那么es会自动分配本机剩余内存的一半，给到es自身使用。如果是使用JAVA_HOME，默认仅仅分配1G的内存。es是非常耗内存的，尤其是数据量大的时候，所以尽量分配多些内存给它。 

es的关键配置文件是config目录下的elasticsearch.yml：

```
#集群名
cluster.name: es-cluster
#节点名
node.name: es-0
#数据存储目录
path.data: /path/to/data
#日志存储目录
path.logs: /path/to/logs
#服务ip地址 配置为0.0.0.0时，可支持外部访问
network.host: 192.168.6.1
#默认的es端口，如果在本机启动多个es服务，该端口会自动配置为9201、9202...
#http.port: 9200
#es节点之间通信的接口
#transport.tcp.port: 9300
#锁定物理内存地址，避免es使用swap交换分区，如果使用swap，es的效率会变差
bootstrap.memory_lock: true
#用于单播集群部署时，配置各个节点的ip
#discovery.seed_hosts: ["192.168.6.1:9300", "192.168.6.2:9300"]
#初始化主节点的名称
cluster.initial_master_nodes: ["es-0"]
#删除索引库的时候必须显式指定
action.destructive_requires_name: true
```