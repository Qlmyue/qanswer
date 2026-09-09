---
title: "kafka的数据文件解析（二）"
slug: kafka-data-file-analyse-2
date: 2021-08-12 14:52:44
category: java
tags: [java, java, kafka, 精品]
status: published
views: 1735
---

首先很有必要的介绍下kafka的几个必要概念。

### Broker

Broker代表一个kafka服务，这其实是相对于集群环境来说的。在集群中，可以启动多个kafka，每个kafka都是一个broker。而每个kafka都有自己的唯一标识，这在server.properties配置文件中是可以看到的：

```
broker.id=0
```

### Topic

Topic就是主题，也就相当于消息组的概念。生产者向某个特定的topic生产消息，而消费者从这个特定的topic去获取消息。每创建一个topic，kafka的数据目录下必定会生成一个几乎同名的子目录，用以存储相关数据。

```
##创建topic的指令 （如果是linux系统，请把bat文件改为sh文件）
.\bin\windows\kafka-topics.bat --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic test
```

执行创建指令后，可以看到目录中多了个文件夹：

[

![](https://www.freebytes.net/wp-content/uploads/2021/08/image-11.png)

]()图1

### Partition

partition就是分区， 也就是将topic分开存储的意思。topic与partition是一对多的关系，一个topic的消息，可以分别存储于不同的partition。创建topic的时候，默认是一个topic带一个分区。可以指定一个topic带两个分区：

```
##创建topic的指令 （如果是linux系统，请把bat文件改为sh文件）
.\bin\windows\kafka-topics.bat --create --zookeeper localhost:2181 --replication-factor 1 --partitions 2 --topic test
```

如此，看数据目录：

![](https://www.freebytes.net/wp-content/uploads/2021/08/image-12.png)

图2

有“test-0”“test-1”两个目录，对应两个分区，分别存储着topic为“test”的消息，这些消息被记录在两个目录下的日志文件中。0和1只是区分不同分区的标识。 默认情况下，生产的消息会被平均分配到这两个分区，两个分区并不会重复存储同一个消息。

不过，在只有一个broker的情况下，对同一个topic来说，其实一个分区就足够了。

### replication-factor

副本因子，其实就是分区的副本数目。副本就是分区目录的拷贝，分区中有多少消息，副本中就有多少消息。

对于每个分区，可以创建指定数目的副本。也就是说，如果你创建了一个分区数为2、副本数为1的topic，那么将会产生两个目录，也正如上图所显示的，会有“test-0”“test-1”两个目录。

公式如此：分区目录=指定分区数量 * 指定副本数量 。

在只有1个broker的情况下，只能允许topic指定一个副本数。副本数必须<=broker数目。因为，副本只有存储在不同的broker上才有意义，当其中一个broker挂掉后，另一个broker可以依靠副本继续工作。

如果你想创建一个带有2个副本、N个分区的topic，那么你至少需要启动两个kafka。

### producer

生产者，向kafka写入消息，并分配到某个分区中。

### consumer

消费者，一个消费者组可以有多个消费者。但在一个topic中，它的每个分区都只能被同一个消费者组的其中一个消费者消费，如下图：

[

![](https://www.freebytes.net/wp-content/uploads/2023/02/image-1024x631.png)

]()

上图多出的两个consumer，不会有所作为，同组中，每个分区只能被一个consumer消费，不然就无法保证偏移量的准确提交。

倘若，两个消费者负责同一个分区，那么就意味着两个消费者同时读取分区的消息，由于消费者自己可以控制读取消息的offset，就有可能发生这种情况：

1. C1读到offset=1，而C2读到offset=2
2. C1还没处理完，C2已经读到3了，并且主动提交了offset=3
3. C1处理完 offset=1，又将 offset=1 提交上去了
4. 事情乱套了

简单总结下同组中，消费者数量和分区的关系：

1. 如果消费者的数量多于分区，那么一些消费者将处于空闲状态，因为他们没有可供读取的分区。
2. 如果您的分区比消费者多，那么消费者将收到来自多个分区的消息。
3. 如果您有相同数量的消费者和分区，则每个消费者都会从一个分区中按顺序读取消息。

不同组的情况下是这样的：

![](https://www.freebytes.net/wp-content/uploads/2023/02/image-1-1024x761.png)