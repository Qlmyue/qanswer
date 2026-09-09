---
title: "最简单的ElasticSearch集群部署（单播）："
slug: elasticsearch-simple-cluster-1
date: 2021-12-10 08:09:50
category: java
summary: "用最简洁的配置实现elasticsearch的单播集群部署。"
status: published
views: 1547
---

es的集群部署，最好保证至少有三个服务器，能起码部署三个节点，两个作为主节点，一个作为数据节点，这是官方的建议。

准备三个服务器：服务器-0，服务器-1，服务器-2，每个服务器上，部署一套es，我这里的版本是（7.15.2），并配置环境变量：

|  ES_JAVA_HOME        | E:\es\elasticsearch-7.15.2\jdk  （es自带的jdk目录）  |

### 配置文件

找到es的config目录下的elasticsearch.yml，每个服务器的配置文件如下——

服务器-0 

```
#集群名
cluster.name: es-cluster
#节点名
node.name: es-0
#配置本机es服务可以被网络内其他主机访问
network.host: 0.0.0.0
#这里写三台服务器各自的ip，9300是es服务各自通信的接口
discovery.seed_hosts: ["192.168.60.13:9300", "192.168.60.17:9300","192.168.60.6:9300"]
#初始化一个主节点
cluster.initial_master_nodes: ["es-0"]
```

服务器-1   

```
#集群名
cluster.name: es-cluster
#节点名
node.name: es-1
#配置本机es服务可以被网络内其他主机访问
network.host: 0.0.0.0
#这里写三台服务器各自的ip，9300是es服务各自通信的接口
discovery.seed_hosts: ["192.168.60.13:9300", "192.168.60.17:9300","192.168.60.6:9300"]
#初始化一个主节点
cluster.initial_master_nodes: ["es-0"]
```

服务器-2  

```
#集群名
cluster.name: es-cluster
#节点名
node.name: es-2
#配置本机es服务可以被网络内其他主机访问
network.host: 0.0.0.0
#这里写三台服务器各自的ip，9300是es服务各自通信的接口
discovery.seed_hosts: ["192.168.60.13:9300", "192.168.60.17:9300","192.168.60.6:9300"]
#初始化一个主节点
cluster.initial_master_nodes: ["es-0"]
```

依次启动服务器0、1、2。启动成功后一分钟左右，你访问http://192.168.60.13:9300:9200/_cat/nodes  便可以看到集群中三个节点信息。