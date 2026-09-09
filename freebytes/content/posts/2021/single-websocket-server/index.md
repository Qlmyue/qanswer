---
title: "一个独立部署的websocket服务"
slug: single-websocket-server
date: 2021-08-08 10:35:55
category: java
tags: [java, java, springboot, websocket]
status: published
views: 1634
---

将websocket作为一个独立的服务部署起来，并且提供调用发送消息的api组件，由开发项目直接引入这个组件，就能便捷调用websocket的api，实现发送消息的功能。并且在微服务架构中，多个服务都可以调用这个websocket服务。

源码的地址：

[https://gitee.com/freebytes/single-websocket.git]()