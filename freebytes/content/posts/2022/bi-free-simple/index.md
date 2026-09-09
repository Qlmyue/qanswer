---
title: "介绍几款免费的大数据BI分析工具"
slug: bi-free-simple
date: 2022-11-25 09:08:15
category: 大数据
status: published
views: 3537
---

最近用过几款大数据的BI分析工具，都是免费的，都支持自助生成BI组件功能、 支持自定义仪表盘 ，基本能支持主流的数据库， 可作为数仓的可视化工具。

### DataEase 

这款软件是开源的，也支持商业化应用。内置不少免费的模板，也支持很多数据源。

[

![](https://www.freebytes.net/wp-content/uploads/2022/11/image-1024x595.png)

]()

[

![](https://www.freebytes.net/wp-content/uploads/2022/11/image-1-1024x380.png)

]()

添加数据源之后，可以在数据集中预览数据表，可以在仪表盘中新建组件，配置视图。

[

![](https://www.freebytes.net/wp-content/uploads/2022/11/image-2-1024x707.png)

]()

最后做出来的效果，也是可以杠杠的：

[

![](https://www.freebytes.net/wp-content/uploads/2022/11/image-3-1024x587.png)

]()

[官网]()里面有部署文档和视频教程，github上也有开源的代码，star数量还是可以的，有8k以上。但是如果想用全部的功能，那部署起来会有些麻烦。用起来还是可以的，支持移动端和PC端，全程不用编程实现BI图表生成。但是有一点想吐槽一下：它的源码注释相当相当少！

FineBI

这款软件似乎被誉为国产最佳BI工具，自然也是涵盖去编程化的BI生成技术，支持的数据源也非常多：

[

![](https://www.freebytes.net/wp-content/uploads/2022/11/image-4-1024x389.png)

]()

支持移动端和PC端，功能丰富，部署简单。但是呀，他不开源。[官网]()是可以下载安装包的， 为免费试用版和商用版，免费试用版享有全部功能，不限制时间，但限制2个并发，而商业版无限制 。

### Superset

这是一款非常棒的国外BI产品，拥有超过49k的star数。官网地址：[https://superset.apache.org/]()。它更加轻量级，支持docker部署，部署较为简便。

![](https://www.freebytes.net/wp-content/uploads/2022/11/image-5.png)

同样支持丰富的数据源：

[

![](https://www.freebytes.net/wp-content/uploads/2022/11/image-6-1024x516.png)

]()

它默认不支持excel导入，但是可以通过配置开启这个功能。

就个人而言，还是比较偏向于使用superset，毕竟star数摆在那里，关键人家还是开源的。