---
title: "Hadoop中的文件实际存储在哪里？"
slug: hadoop-file-store
date: 2022-10-28 14:22:32
category: 大数据
tags: [hadoop, 大数据, 精品]
status: published
views: 3481
---

### hdfs文件系统界面

当我们把文件上传到hadoop中，我们可以在页面上查看hdfs文件系统的信息。如下图，我在/input目录下上传了一个jdk文件，大概201M，但我的block-size设置成了64M，所以它会被切割成4个block，64M*3+9M=201M。

[

![](https://www.freebytes.net/wp-content/uploads/2022/10/image-1024x378.png)

]()

但我们的副本数设置成3，也就是说每个block会有3个副本，一共是12个block。

那这12个block分别存储在哪里了呢？

点击jdk文件，可以看到更加具体的信息：

[

![](https://www.freebytes.net/wp-content/uploads/2022/10/image-1-1024x701.png)

]()

这里有几个关键信息，block0，block id，size，availablility，我先分别解释一下。 

[

![](https://www.freebytes.net/wp-content/uploads/2022/10/image-2.png)

]()

可以看到，这里一共有4个block，代表的是四个block以及他们的副本，即：

block0 = block0-0， block0-1 ， block0-2 
block1 = block1-0， block1-1 ， block1-2 
...

而每个block的size，都是67108864，也就是64M，但block3是9M。

一共有四个block id，分别对应block0、block1、block2、block3。

Availablility代表的是block所在的机器名。

如下图，我们记录一下block3的id，这个id是： 1073742324 ，大小是9M，分散存储在集群中的三个机器：hd-master，hd-slave1，hd-slave2。

[

![](https://www.freebytes.net/wp-content/uploads/2022/10/image-3.png)

]()

然后，我们去机器上找一下这个block的具体存储位置。

### hdfs文件的真实存储位置

先去hd-master上，看配置文件hdfs-site.yml中的数据配置：

```
<property>
    <name>dfs.datanode.data.dir</name>
      <value>/export/software/hadoop-3.3.4/data</value>
</property>    
```

由此得知，我们的数据是存储在/export/software/hadoop-3.3.4/data这个目录下的。然后cd命令进入这个目录，

```
cd /export/software/hadoop-3.3.4/data/current/BP-1700483297-127.0.1.1-1663298915277/current/finalized/subdir0/subdir1
```

这个目录，每个机器可能不一样，但是大同小异，自己多试试，用ls -l就能查看到文件了：

[

![](https://www.freebytes.net/wp-content/uploads/2022/10/image-4-1024x320.png)

]()

看这两个文件，blk_后面接的就是block3的id，一个是数据文件，一个是元数据文件，数据文件的大小刚好就是9M。

接着，把hd-slave1和hd-slave2的这个目录的文件也查看一下，都发现了这个文件，也就是刚好3个副本。

数据文件是可以用cat没命令输出到控制台的，不过只有文本格式的才能看懂，其他格式的会输出一堆乱码。