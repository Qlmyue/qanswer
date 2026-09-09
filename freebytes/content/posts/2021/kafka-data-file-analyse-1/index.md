---
title: "kafka的数据文件解析（一）"
slug: kafka-data-file-analyse-1
date: 2021-08-10 15:49:35
category: java
tags: [java, java, kafka, 精品]
summary: "学会看kakfa内部存储目录及文件，是学习kafka的很关键的一步。知道数据是怎么存储的，一些关键的kafka机制也就有了大概的推测。"
status: published
views: 2348
---

学会看kakfa内部存储目录及文件，是学习kafka的很关键的一步。知道数据是怎么存储的，一些关键的kafka机制也就有了大概的推测。

### 数据目录下有哪些文件

我在kafka的配置文件上设置了数据存储目录：log.dirs=./kafka-data。
那么进入这个目录，看下里面都有哪些文件。

初始情况下是这样的：

[

![](https://www.freebytes.net/wp-content/uploads/2021/08/image-2.png)

]()

然后我们新建一个topic并生产些数据：

```
##创建topic---test
 .\bin\windows\kafka-topics.bat --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic test

##生产数据  输入字符串 1212121212121212121212sdsdsdsdsdsdsdsdsdsds
 .\bin\windows\kafka-console-producer.bat --broker-list localhost:9092 --topic test
```

这时候数据目录下多了个文件夹test-0，前面的字符串正好是我们新建的topic的名字。

[

![](https://www.freebytes.net/wp-content/uploads/2021/08/image-3.png)

]()

进入里面看：

[

![](https://www.freebytes.net/wp-content/uploads/2021/08/image-4.png)

]()

其中，.log文件正是存储我们生产的消息的文件，由于我生产的消息数字和英文字符“1212121212121212121212sdsdsdsdsdsdsdsdsdsds”，所以可以直接打开文件查看，你一定能在一串乱码中找到它。

[

![](https://www.freebytes.net/wp-content/uploads/2021/08/image-5.png)

]()

所以，kafka的数据最终还是以文件作为载体的。所有的kafka消息都会被记录到ta的log文件中，需要加载这些消息的时候再从文件中寻找，并读取出来。

那么问题来了，如果只是将字符简单地放到一个日志文件中，日积月累下，文件变得很大，那么数据检索就会变得非常慢。

于是，在server.properties的配置中，还有这么一行配置：

```
##log文件存放着msg，这里设置的是log文件的最大大小，默认最大为1个G【单位为：byte】
log.segment.bytes=1073741824
```

当文件的容量超过配置值的时候，就会另外新建一个日志文件，用新的文件去存储新的数据。

[

![](https://www.freebytes.net/wp-content/uploads/2021/08/image-6.png)

]()

### offset的概念

说到这里，引入一个概念，offset。

大家知道，生产消息与消费消息的行为，并非同步的。你今天生产了100个消息，我今天可能只能消费50个。我需要记录下今天消费到了哪一个消息，我明天才能断点重续，继续消费剩下的消息。那么这个记录值就是offset。

消费者需要向kafka服务器提交这个offset，因为只有消费者自己才知道他消费到了哪里。这个offset值，默认被保存到了kafka服务器中，在消费者下一次消费的时候，服务器直接返回offset对应的消息值给它。

那么问题来了，kafka怎么根据这个offset值，从一堆log文件里面准确找到对应的消息值呢？

### 索引文件

[

![](https://www.freebytes.net/wp-content/uploads/2021/08/image-8.png)

]()

这里可以注意到，每个log日志文件，都会有一个对应的.index文件，这个叫索引文件。索引文件存储了KV键值对信息，K为offset的偏移值，V为物理偏移量。这么说太过抽象了，看图吧：

[

![](https://www.freebytes.net/wp-content/uploads/2021/08/image-9.png)

]()

以0000000000000000014.index文件为例，文件内容如上图。其中文件名中的 0000000000000000014 ，表示offset偏移量>= 0000000000000000014 的消息可以从这个索引文件中检索。

再看第二行的KV值，K为3，表示offset偏移量为 0000000000000000017（ 0000000000000000014 +3）的消息，它在 0000000000000000014.log文件中的物理偏移量为497，也就是从该日志文件开头处偏移497个物理位置，就能获取到对应的消息值。

如图中所画，并非每个offset都会生成一个索引KV记录，默认是当消息的累计字节数大于400时，保存一条索引记录。

### topic的名字和对应的目录

kafka中topic相当于是一个消息组的概念，在数据目录下，kafka会新建一个与topic同名的目录，里面存储多个日志文件和索引文件，用来存放消息值。

那么上面我们说到，我们新建了一个topic：test。然后我们看到了一个名为“test-0”的目录，那么这个0是指什么呢？还会不会有“test-1”呢？

具体请查阅[《kafka的数据文件解析（二）》]()。