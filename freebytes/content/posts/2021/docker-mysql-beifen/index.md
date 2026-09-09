---
title: "docker部署的mysql，做增量备份和全量备份"
slug: docker-mysql-beifen
date: 2021-01-21 08:29:58
category: java
tags: [docker, java, java, linux, mysql]
status: published
views: 3092
---

## 简介

为docker部署的mysql容器，提供一个兼增量备份和全量备份的解决方案。

## 全量备份

我们尽量做定时的自动化的全量备份，备份工具选择mysqldump：

```
mysqldump -uroot -proot --databases test > /data/mysql/data/backup/backup-$(date).sql
```

（/data/mysql/data/backup此目录必须存在，其中test 是数据库名）
需要定时就需要crontab工具，使用crontab，每分钟执行一次上面的指令：

```
#编辑定时器
crontab -e 
#输入定时执行的指令
* * * * * mysqldump -uroot -proot --databases test > /data/mysql/data/backup/backup-$(date).sql
```

编辑结束，定时指令即刻生效，可使用tail -f  /var/log/cron查看crontab的执行日志。

但是有些linux环境下并没有mysqldump工具，mysql容器内也没有crontab，所以既不能在mysql容器内执行上面的指令，也不能在容器外部执行。

这样的话，你可以选择在容器外部，执行mysql容器的内部指令。上面的步骤不变，唯一需要改变的是将指令改成：

```
 * * * * *  docker exec  mysql mysqldump -uroot -proot --databases test > /data/mysql/data/backup/backup-$(date).sql 
```

## 增量备份

关于增量备份的详解请直接查看我的上篇文章：

[https://www.freebytes.net/it/java/dokcer-mysql-binlog.html]()