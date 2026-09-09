---
title: "Docker部署samba共享文件服务器"
slug: docker-samba
date: 2020-01-08 09:27:04
category: Linux
summary: "利用Docker的samba容器，可以方便地部署和维护一个共享文件夹服务器。"
status: published
views: 4111
---

## 简介

利用Docker的samba容器，可以方便地部署和维护一个共享文件夹服务器。

## 实现步骤

1、下载镜像

```
docker pull dperson/samba
```

 2、运行容器 

```
docker run -it --name samba -p 139:139 -p 445:445 \
-v /home/freebytes:/mount    \
-d dperson/samba          \
-w "WORKGROUP"        \
-u "freebytes;freebytes"              \
-s "share;/mount/;yes;no;no;all;none"
```

3、参数解释

```
-v /home/freebytes:/mount   挂载本地目录到共享文件夹
-w "WORKGROUP"              配置工作组
-u "freebytes;freebytes"    添加一个用户名和密码
-s "share;/mount/;yes;no;no;all;none"  设置共享文件夹的别名为share，设置文件夹可访问，设置文件非只读性，设置guest用户不能访问，设置用户列表和管理员列表。
```

## 访问

file://ip/share  或者  \\ip\share