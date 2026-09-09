---
title: "ClouderaManager和Ambari"
slug: clouderamanager-ambari-distance
date: 2022-12-02 01:34:07
category: 大数据
tags: [Ambari, 大数据, 精品]
status: published
views: 2817
---

### 大数据集群运维艰难 

运维过hadoop集群的人都应该清楚，hadoop生态从安装、配置到后期运维是一个非常艰辛的过程，一般来说安装hadoop可能就需要几天时间，运维一个小型集群同样需要几个人。ambari和cloudera Manager这两个系统，目的就是简化hadoop生态集群的安装、配置，同时提高hadoop运维效率，以及对hadoop集群进行监控。 

### ClouderaManager 

ClouderaManager，是一套用于管理和监控 CDH 集群的软件，简称CM，通过它提供的 web 管理页面操作就可以轻松的管理和监控CDH 集群环境。它提供可视化管理各大数据组件的配置、服务管理、监控等功能。使用CM可以轻松部署cdh堆栈和其他托管服务。

CM特性：

- CM通过对CDH集群的各部分提供精细的可视化和控制，建立了企业级部署的标准，增强了操作人员的能力以提升性能、提升服务质量、提高合规性、降低管理成本。
- 安装过程自动化，使集群部署时间从几个星期减少到几分钟；
- 集群范围、实时的主机和服务运行情况的视图；
- 单一的中央控制台，以对集群配置进行变更；
- 采用全方位的报告和诊断工具来帮助你优化性能和利用率。
- CM的核心是Cloudera Manager Server。Server承载了管理员控制台（Admin Console Web Server）和应用逻辑，并负责安装软件、配置、启动、停止服务，以及管理运行有服务的集群。

应用场景：

1. 适用干节点在5个以上，各类大数据服务超过5个的集群，大为有些小公司紧紧就用了hdfs、yarn、hive、spark几个服务，为了节省服务器等资源，不需要部署cm。
2. 适用于所有的大数据公司。
3. 适用于对于大数据组件版本不需要经常变动的公司，例如:有些公司就是喜欢钻研新技术，然后喜欢新版本。但是由于cm的免费版本不支持弹性升级，所以不建议喜欢新技术的公司用。
4. 适用于运维人员，因为该平台安装好以后，维护工作相对来将就轻松许多，例如:使用apache版本的运维人员，对某一个组件进行调优，需要消耗半天的时间进行调整，效率极低;再比如安装1000个节点，需要手动部署，工作量可想而知。

补充:

ClouderaManager在国内用户量很大，戴尔、一号店等知名公司都在使用 cm和ambari在主流的大数据平台框架中，用户量比例很高。它细分为免费的Express版本和功能完全并提供众多增值服务的收费版本Enterprise。 

### Ambari

Ambari是Apache软件基金顶级项目，它是一个基于web的工具，用于安装、配置、管理和监视Apache Hadoop集群，支持Hadoop HDFS,、Hadoop、MapReduce、Hive、HCatalog,、HBase、ZooKeeper、Oozie、Pig和Sqoop。Ambari同样还提供了集群状况仪表盘，比如heatmaps和查看MapReduce、Pig、Hive应用程序的能力，以友好的用户界面对它们的性能特性进行诊断。 

### 两者的区别

| 不同点 | apache Ambari | ClouderaManager Express(免费版) |
| 配置版本控制和历史记录 | 支持 | 不支持 |
| 二次开发 | 支持 | 不支持 |
| 集成 | 支持 | no (不支持redis、kylin、es) |
| 维护 | 依靠社区力量 | cloudera做了一些定制开发，自行维护或打patch会离社区越来越远 |
| 权限控制 | ranger(相对简单) | sentry(复杂) |
| 视图定制 | 支持创建自己的视图，添加自定义服务 | 不支持 |

出版商:

- hortonworks研发了Ambari和hdp的大数据分析集成平台
- cloudera研发了cloudera manger和cdh大数据分析集成平台

稳定性:

- cloudera相对来说比较稳定
- ambari相对来说不稳定(页面打开速度慢)

资源消耗:

- cloudera manager的server端Xmx是2G,agent是1G,但是有host monitor和service monitor总共大概1G
- ambari的server端Xmx是2G,metric的ams和hbase的env大概也就是2G

集群重启:

- cloudera支持滚动重启(hdfs需要设计成ha,才能滚动重启)
- ambari支持滚动重启(hdfs需要设计成ha,才能滚动重启)

集群升级(一般来讲不要轻易升级集群):

- cloudera不支持滚动升级服务
- ambari支持滚动升级服务(这个是ambari的优点,hdfs必须是ha)

二次开发:

- cloudera不支持
- ambari支持

服务版本:

- cloudera较老
- ambari较新

服务集成性:

- cloudera较弱
- ambari较强,支持es、redis、presto、kylin等

体验效果:

- cloudera好
- ambari相对差

安装过程:

- cloudera复杂
- ambari简单

邮件报警:

- cloudera支持不好
- ambari支持很好

安装包:

- cloudera是parcel包
- ambari是rpm包

### 集群部署方式

常见的情况是，用ClouderaManger去部署CDH, 用Ambari去部署HDP，当然，两者也可以互相替换。