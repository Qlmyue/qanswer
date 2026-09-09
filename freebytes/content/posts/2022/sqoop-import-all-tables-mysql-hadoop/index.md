---
title: "使用Sqoop import-all-tables将mysql的数据库全量导入Hadoop"
slug: sqoop-import-all-tables-mysql-hadoop
date: 2022-12-01 09:02:09
category: 大数据
status: published
views: 2437
---

### import-all-tables的作用

Sqoop中的工具import-all-tables可以将所有指定库中的所有表导入到HDFS，这样可以不用一个一个表的进行导入了。

###  使用示例：

```
sqoop import-all-tables \
"-Dorg.apache.sqoop.splitter.allow_text_splitter=true" \
--connect jdbc:mysql://test.com:3306/legendshop_v60_sr1 \
--username root \
--password 12345678 \
--autoreset-to-one-mapper \
--fields-terminated-by '\t' \
--num-mappers 4 \
--hive-import \
--hive-database legendshop_v60_sr1 \
--hive-overwrite 
```

### 主要参数解释

--connect           数据库链接
--username        数据库用户名
--password         数据库密码
--fields-terminated-by   hadoop上的文件分隔符
--num-mappers <n>：使用n个mapper任务并行导入 
--hive-database  hive上的数据库名，需要提前建好
--hive-overwrite  指定覆写

### import-all-tables的运行规则

1. hive需要提前建库，但不用提前建表，sqoop会自动建表。
2. 库中所有的表，是遍历导入的。每个表的导入都会执行一个MapReduce 任务 （如果觉得慢，可以替换为Spark引擎）。效率会很低，但是省事。
3. sqoop会先将数据存放到hdfs的中转目录中，然后用load语法加载文件到hive数据表，加载完成中，中转目录的数据会被删除。
4. 如果hive中已经存在表，它不会删除，而是直接load数据。
5. 每一次的导入，都会覆盖原先的数据。
6. 当源库中的某个表结构发生变化时，如果hive中对应的表结构没有修改，表也不删除，那么导入的数据会有问题，字段会对不上。

### 优缺点

相比于Sqoop中的--hive-import（单表导入）， import-all-tables 可以实现全库导入，配置起来也方便快捷。但是它有两个严重的缺陷： 当源库中的某个表结构发生变化时，hive中的对应数据表必须要做调整或者删除；当网络情况不好的时候，导入过程会被中断！