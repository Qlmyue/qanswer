---
title: "SpringCloud 踩坑记——zuul大文件上传"
slug: zuul-upload
date: 2019-08-28 01:48:24
category: java
tags: [java, java, springcloud, zuul]
summary: "本文详细介绍在springcloud项目中，使用zuul作为网关代理，使用微服务上传文件的情况下，所出现的问题以及解决方式。"
status: published
views: 6178
---

### 简介

本文详细介绍在springcloud项目中，使用zuul作为网关代理，使用微服务上传文件的情况下，所出现的问题以及解决方式。

### zuul上传大文件问题

我的上传微服务是my-source，端口是8081；zuul的端口是8091，路由配置是

`zuul.routes.source.path=/source/**`
`zuul.routes.source.serviceId=srp-source`
`zuul.routes.source.sensitiveHeaders=`

就是说，所有以/source开头的路径，都会被转发到my-source服务中。比如localhost:8091/source/getUser 就会被代理到my-source的服务中，实际上是变成了localhost：8081/getUser

在我的my-source中，有个上传接口：`my/source/upload` 接收一个multipart对象。这时从浏览器发起文件上传请求——`localhost:8091/source/my/source/upload`，那么就会被转发到这个上传接口。这样一来，文件先经过了zuul，然后再交给my-source，会在临时文件夹里生成两个临时文件，zuul生成一个，my-source生成一个；并且，zuul的堆内存会随着文件的传入而变化，小文件无所谓，但是大文件，会使得堆内存急速增加，有可能是因为在zuul中使用类似了`byte[] buf=file.getBytes()`这样的操作，当多个大文件同时传入，内存一下子挤满了堆空间，而且上传是一个慢性过程，jvm无法对正在处理的对象进行回收，就会产生OOM异常。在测试初期，开发者可能不会一下子上传太多的大文件，并不能发现这个问题。

如果需要测试，那么需要注意下，在分配堆空间1G的情况下，按照默认比例，年轻代和老年代1:2，eden和两个survior区是8:1:1，也就是当内存到达`1000m*4/15=270m左右`，就可能触发年轻代垃圾回收，也就是说当你上传的文件总量至少要达到220m左右，才会触发垃圾回收，（假设剩下的70m用于分配jvm初始内存）。但是这个垃圾回收也不是一定的，因为太大而明显超出这个容量的对象会被直接分配到老年代，老年代的垃圾回收没有那么频繁，上限也比年轻代高。所以你当上传的总量达到三四百兆时，也不一定会造成OOM，反正就尽量多上传呗。

### 官方文档的介绍

> 

如果您@EnableZuulProxy您可以使用代理路径上传文件，只要文件很小，它就应该工作。对于大文件，有一个替代路径绕过“/ zuul / *”中的Spring DispatcherServlet（以避免多部分处理）。也就是说，如果zuul.routes.customers=/customers/**则可以将大文件发送到“/ zuul / customers / *”。servlet路径通过zuul.servletPath进行外部化。如果代理路由引导您通过Ribbon负载均衡器，例如，超大文件也将需要提升超时设置

```
application.yml
hystrix.command.default.execution.isolation.thread.timeoutInMilliseconds: 60000
ribbon:
  ConnectTimeout: 3000
  ReadTimeout: 60000

```

> 

请注意，要使用大型文件进行流式传输，您需要在请求中使用分块编码（某些浏览器默认情况下不会执行）。例如在命令行：
$ curl -v -H "Transfer-Encoding: chunked"
-F "file=@mylarge.iso" localhost:9999/zuul/simple/file

### 问题解决

参考官方的文档，可知，在接口路径前加上 `/zuul` ，可以避免zuul对请求的部分处理，这部分处理中包括了对文件的详细处理。也就是说在我zuul配置和my-source配置不变的情况下，浏览器可以输入这样的请求`localhost:8091/zuul/source/my/source/upload`，这个请求一样会转发到my-source的上传接口，这个`/zuul`只是作为一个告知zuul不对文件进行过多详细处理的前缀。这样子配置后，zuul将会对文件上传请求简要处理后，转发到my-source做具体处理，也避免了内存急速增加的情况。

至于产生此问题的根源嘛，肯定要看源码的咯，springcloud自己也没明说这个原因，说明多少有些坑。但是zuul都快要被抛弃了，还是算了，不研究了。