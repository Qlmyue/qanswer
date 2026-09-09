---
title: "使用kibana自动备份ElasticSearch集群数据"
slug: elasticsearch-backup
date: 2021-12-29 02:41:39
category: java
summary: "本文讲解如何使用kibana可视化备份、恢复ElasticSearch集群数据。"
status: published
views: 2630
---

声明下我的版本号，kibana和es都是7.15.2。

## 修改配置文件

在es的配置文件中增加配置：

```
path.repo: \\192.168.80.146\g\es-backup
```

该配置设置备份文件的根路径，这是个共享文件夹，请保证这个共享路径能够被集群中的es节点共同访问到并且具备写入、读取权限。

## 注册备份仓库

1、启动es和kibana后，输入如下链接进入kibana的备份管理页面（注意将localhost改为你实际的kibana服务的ip）：

[http://localhost:5601/app/management/data/snapshot_restore/repositories]()

2、注册一个备份仓库

[

![](https://www.freebytes.net/wp-content/uploads/2021/12/image-2-1024x597.png)

]()

[

![](https://www.freebytes.net/wp-content/uploads/2021/12/image-3.png)

]()

3、填写仓库的相对路径，这里填了test-repo，那么它的绝对路径就是你刚刚设置的path.repo加上 test-repo ，也就是该仓库的备份地址为：\\192.168.80.146\g\es-backup\test-repo\

[

![](https://www.freebytes.net/wp-content/uploads/2021/12/image-5.png)

]()

4、此时看到仓库列表中已经有一个名为test的仓库。点击policies，进入策略页面。

![](https://www.freebytes.net/wp-content/uploads/2021/12/image-6.png)

## 创建备份策略

简单来说，备份策略就是在什么时间会发生备份行为、备份哪些索引、备份文件何时过期删除，等等一系列操作的定制。

[

![](https://www.freebytes.net/wp-content/uploads/2021/12/image-7.png)

]()

第一步，点击创建一个策略。

[

![](https://www.freebytes.net/wp-content/uploads/2021/12/image-8.png)

]()

第二步，指定你想备份的索引，然后直接点next跳到下一步，后面的选项全部默认。

[

![](https://www.freebytes.net/wp-content/uploads/2021/12/image-9-1024x679.png)

]()

第三步直接跳过，到第四步，检查下你的设置，没有问题就直接创建了。

[

![](https://www.freebytes.net/wp-content/uploads/2021/12/image-10.png)

]()

点击create policy 创建成功。

**以上创建备份策略的可视化操作，也可以在kibana中用命令行的方式完成**，命令行如下：

```
PUT _slm/policy/test-policy
{
  "name": "test-snapshot",
  "schedule": "0 30 1 * * ?",
  "repository": "test",
  "config": {
    "indices": [
      "es_demo"
    ]
  }
}
```

## 执行备份策略

[

![](https://www.freebytes.net/wp-content/uploads/2021/12/image-11-1024x218.png)

]()

此时能够看到新建的策略，点击“run now”按钮，可以立即备份一次，不点击的话，也会按原来的定时策略去执行备份。执行过之后，就会在 Snapshots 列表下生成一个快照，代表的是备份文件。

## 恢复备份

此时的快照列表如下，每个快照都有一个恢复按钮。

[

![](https://www.freebytes.net/wp-content/uploads/2021/12/image-12-1024x231.png)

]()

在恢复备份之前，先执行命令删除掉索引es-demo。

```
DELETE /es_demo
```

点击恢复按钮，选择你想恢复的索引：

[

![](https://www.freebytes.net/wp-content/uploads/2021/12/image-13.png)

]()

其他选项默认，直接跳到最后，点击 restore snapshot，

[

![](https://www.freebytes.net/wp-content/uploads/2021/12/image-14.png)

]()

完成之后，可到恢复列表查看，如下：

![](https://www.freebytes.net/wp-content/uploads/2021/12/image-15.png)

此时，所有工作已完成。