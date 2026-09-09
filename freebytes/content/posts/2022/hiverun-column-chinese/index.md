---
title: "hive运行起来后，让字段名和字段注释支持中文"
slug: hiverun-column-chinese
date: 2022-11-09 07:11:13
category: 大数据
status: published
views: 2391
---

使用hive建表时，字段名和注释默认是不支持中文的。如果已经hive跑起来了，只需要在hive（3.1.3）的mysql中执行两句指令，就可以方便地让字段名和字段注释支持中文：

```
-- 修改表字段注释支持中文字符集
alter table COLUMNS_V2 modify column COMMENT varchar(256) character set utf8 COLLATE utf8_bin;
-- 修改表字段名支持中文字符集
alter table COLUMNS_V2 modify column COLUMN_NAME varchar(256) character set utf8 COLLATE utf8_bin;
```