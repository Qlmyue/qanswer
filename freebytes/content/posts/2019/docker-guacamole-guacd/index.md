---
title: "docker部署guacamole服务端"
slug: docker-guacamole-guacd
date: 2019-12-24 08:38:29
category: java
summary: "继上文《javaWeb系统集成guacamole》，为减轻guacamole本地部署的巨大工作量，本文介绍docker部署guacamole的方式，简便而又快速。"
status: published
views: 4791
---

## 简介

继上文《[javaWeb系统集成guacamole]()》，为减轻guacamole本地部署的巨大工作量，本文介绍docker部署guacamole的方式，简便而又快速。

## 两大镜像

我在《[Guacamole 开发web端远程桌面]()》一文中说过，guacamole服务其实包括两大部分： guacamole-client和guacamole-server 。所以其实docker上的镜像也有两个：guacamole/guacamole和guacamole/guacd。 guacamole/guacamole 对应的是  guacamole-client ， guacamole/guacd 对应的是 guacamole-server 。

如要使javaWeb系统集成guacamole，那么不必考虑 guacamole/guacamole 镜像，因为在web中已经存在自己手写的客户端程序也就是guacamole-client。所以只需要使用到 guacamole/guacd 镜像。

## guacamole/guacd 

guacamole/guacd 镜像的使用方式是：

> 

docker run --name guacd -d -p 4822:4822 guacamole/guacd

如此，即可运行起guacamole的服务端——guacd，web端可在集成guacamole客户端的基础上，直接与此服务交互，获取各vnc客户端的数据。