---
title: "大数据平台CDH、HDP、CDP的区别"
slug: bigdata-platform-cdh-hdp-cdp
date: 2022-11-30 03:59:52
category: 大数据
tags: [hadoop, 大数据, 精品]
status: published
views: 12334
---

部署一套大数据架构是相当麻烦的事情，各种组件、服务配置相当多而杂，由此诞生了能简化各种服务部署和配置的的工具，也就是大数据平台框架。

### CDH 

CDH （ Cloudera Distribution Hadoop ）是 Cloudera 公司提供的包含 Apache Hadoop 及其相关项目的软件发行版本。还有一种说法是 CDH 是 Cloudera Distribution including Apache Hadoop 的缩写。

CDH 的所有组件都是 100% 开源的（Apache License），是唯一提供统一批处理、交互式 SQL、交互式搜索以及基于角色的访问控制的 Hadoop 解决方案。通过将 Hadoop 与十几个其他关键开源项目集成，Cloudera 创建了一个功能先进的系统，可以帮忙你执行端到端的大数据工作流。

CDH 特性
灵活性：存储任何类型的数据，并使用各种不同的计算框架进行操作，包括批处理、交互式SQL、文本搜索、机器学习和统计计算。
集成：在完整的 Hadoop 平台上快速启动和运行，该平台可与广泛的硬件和软件解决方案配合使用。
安全性：处理和控制敏感数据。
可扩展性：启用广泛的应用程序，并根据要求进行扩容扩展。
高可用性：能够胜任关键地方的业务任务。
兼容性：利用现有的 IT 基础设施和资产。 

CDH 6.3 是 CDH 的最后一个主要版本。CDH是Apache hadoop和相关项目中最完整、最稳定、最流行的发行版。 

**CDH 6.3.2 对应的各组件版本号——**
Apache Avro 1.8.2
Apache Flume 1.9.0
Apache Hadoop 3.0.0
Apache HBase 2.1.4
HBase Indexer 1.5
Apache Hive 2.1.1
Hue 4.3.0
Apache Impala 3.2.0
Apache Kafka 2.2.1
Kite SDK 1.0.0
Apache Kudu 1.10.0
Apache Solr 7.4.0
Apache Oozie 5.1.0
Apache Parquet 1.9.0
Parquet-format 2.4.0
Apache Pig 0.17.0
Apache Sentry 2.1.0
Apache Spark 2.4.0
Apache Sqoop 1.4.7
Apache ZooKeeper 3.4.5 

### HDP 

HDP是Hortonworks公司的代表产品，是一个企业级的Hadoop发行版。

|  | CDH | HDP |
|  相同点 |  两者都是免费版。  | 更易于维护，管理，且稳定性高。  |
|  不同点 | 文档详细，但区分免费版和企业版，企业版只有试用期  | HDP版本是比较新的版本，目前最新版（HDP3.1.5）与apache基本同步，因为Hortonworks内部大部分员工都是apache代码贡献者。  |

其他区别：

1. CDH支持的存储组件更丰富
2. HDP支持的数据分析组件更丰富
3. HDP对多维分析及可视化有了支持，引入Druid和Superset
4. HDP的HBase数据使用Phoenix的jdbc查询；CDH的HBase数据使用映射Hive到Impala的jdbc查询，但分析数据可以存储Impala内部表，提高查询响应
5. 多维分析Druid纳入集群，会方便管理；但可视化工具Superset可以单独安装使用
6. CDH没有时序数据库，HDP将Druid作为时序数据库使用

### CDP 

CDP（Cloudera Data Platform）是 CDH 的继任者。CDP 是面向企业的云计算平台。它提供集成的多功能自助服务工具，以分析和集中数据。它在企业层面带来了安全和治理，所有这些都托管在公共、私有和多云部署上。

如果启动一项新项目，建议从 CDP 开始，因为这是 Cloudera 最新一代的技术。根据其官方网站，CDP 可以做到：

1. 必要时自动生成工作负载并在完成后暂停其操作，从而控制云成本
2. 使用分析和机器学习来优化工作负载
3. 显示所有云和瞬态集群的数据血缘关系
4. 使用单一的管理平台来使用混合云和多云
5. 可以扩展到 PB 级数据和成千上万多种多样的用户
6. 使用多云和混合环境集中控制客户和操作数据
7. CDP 有两个版本：CDP 公共云和 CDP 私有云。

CDP私有云的部署依赖ClouderaManager。

### 相对于CDH/HDP，CDP有什么改进

CDP是原先两个最好的企业级数据分析平台CDH和HDP融合在一起，同时增加一些新的功能，形成的一个新平台。这个平台有40多个组件，是可以提供更多功能的企业级分析平台。这个平台集合了CDH和HDP的精华来创建，把一些过时的技术淘汰掉，再融合新的技术，把双方差异性的技术保留下来，同时升级共享一些技术得到最新版本。

值得一提的是，前两年官方已经声明，会逐渐停止对CDH和HDP的升级和维护。现在估计已经完全停了。