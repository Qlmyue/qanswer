---
title: "Docker部署http服务器"
slug: docker-http-nginx
date: 2020-01-08 09:39:29
category: Linux
summary: "利用Docker的nginx容器，可以方便的部署一个简单的http服务器"
status: published
views: 2496
---

## 简介

利用Docker的nginx容器，可以方便的部署一个简单的http服务器

## 实现步骤

1、下载镜像

```
docker pull nginx
```

2、运行容器

```
docker run -p 80:80 --name http  \
-v /home/freebytes/html:/usr/share/nginx/html  \
-d nginx
```

3、将index.html放入挂载目录/home/freebytes/html中，即可被访问到。

## 访问

http://localhost/index.html