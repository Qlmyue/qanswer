---
title: "Docker部署Mysql，挂载日志、配置文件和数据，开启binlog"
slug: dokcer-mysql-binlog
date: 2021-01-20 08:45:56
category: java
tags: [docker, java, mysql, 精品]
summary: "Docker部署Mysql，挂载日志、配置文件和数据，开启binlog"
status: published
views: 7355
---

## 简介

利用Docker的mysql容器，可以方便的部署一个简单的mysql服务器

## 实现步骤

1、下载镜像

```
docker pull mysql
```

2、运行容器

```
docker run -d -p 3306:3306 --name your_db_name -v /your_directory/mysql/data:/var/lib/mysql -v /your_directory/mysql/conf:/etc/mysql/conf.d -v /your_directory/mysql/log:/var/log/mysql  -e MYSQL_ROOT_PASSWORD=your_password  mysql
```

3、参数解析

```
-v /your_directory/mysql/data:/var/lib/mysql     挂载数据库数据
-v /your_directory/mysql/conf:/etc/mysql/conf.d  挂载配置文件
-v /your_directory /mysql/log:/var/log/mysql     挂载数据库日志
-e MYSQL_ROOT_PASSWORD=your_password             数据库root用户的密码
mysql                                            镜像名
--name your_db_name                              定义的容器名
-d                                               后台运行容器
```

## 创建可供外部访问的用户

```
CREATE USER test@'%' IDENTIFIED BY 'test';
GRANT ALL privileges ON test.* TO test@'%';
FLUSH PRIVILEGES; 
```

## 开启binlog日志

在/your_directory/mysql/conf目录下，新建文件my.cnf，因为我们做了挂载映射，因此 /your_directory/mysql/conf/my.cnf相当于是容器内的/etc/mysql/conf.d/my.cnf。
而MySQL的容器实例设置会组合 /etc/mysql/my.cnf 和 /etc/mysql/conf.d/my.cnf 两个配置文件。

在my.cnf中输入以下内容：

```
[mysqld]
log-bin=/var/lib/mysql/mysql-bin  
server-id=1
binlog_format=MIXED
expire_logs_days=30  
##binlog日志有三种格式：Statement、Row以及Mixed。 mysql默认采用statement，
##这里使用mixed
##expire_logs_days是日志过期时间，这里配置为30天，默认是0，0是永久的意思 
```

重启容器docker restart mysql，即可开启binlog。可使用相关命令查询binlog：

```
##查看binlog日志是否开启
show variables like '%log_bin%';
##查看binlog日志路径
show variables like '%datadir%';
##刷新日志，会新建一个binlog日志文件
flush logs
##查看日志详情内容
show binlog events in 'mysql-bin.000002'; 
##查看日志过期时间  0为永久
show variables like 'expire_logs_days';
```

## 通过binlog日志恢复数据

mysql自带mysqlbinlog工具。进入docker容器直接运行指令：

```
mysqlbinlog  --start-datetime='2021-01-20 05:02:02' --stop-datetime='2021-01-20 09:02:02' /var/lib/mysql/mysql-bin.000001 | mysql -u root -p 
```

即可恢复数据。其中参数解释如下：

```
--start-datetime='2021-01-20 05:02:02'  开始时间
--stop-datetime='2021-01-20 09:02:02'   结束时间
/var/lib/mysql/mysql-bin.000001         binlog日志文件，如有多个文件，可按顺序              写下，以空格隔开
| mysql -u root -p                      表示以root账号执行mysql的数据恢复操作
```

更多与binlog操作相关的信息可参考这篇文章：https://www.iteye.com/blog/flyer0126-2210993

另外分享一篇关于全量备份和增量备份的方案的博文：
https://blog.51cto.com/wangweiak47/1589304