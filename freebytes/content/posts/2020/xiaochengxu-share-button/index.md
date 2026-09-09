---
title: "小程序，想隐藏右上角的分享按钮？"
slug: xiaochengxu-share-button
date: 2020-05-14 08:54:04
category: 前端
tags: [前端, 前端]
summary: "有些人看到了官方的文档，以为只要调用一下 wx.hideShareMenu 函数就好了，但其实这个按钮是去不掉的。"
status: published
views: 4492
---

### 简介

在做小程序的页面设计时，有些UI可能不太了解小程序，设计时把右上角的分享按钮去掉了。

[

![](https://www.freebytes.net/wp-content/uploads/2020/05/image-19.png)

]()

### 官方文档有错

因此，有些开发员一定会去找办法解决，想把这歌按钮块去掉，但其实，这个按钮是去不掉的。可能有些人看到了官方的文档，以为只要在js的 onLoad 函数中调用一下 [wx.hideShareMenu]() 函数就好了，毕竟这个文档写得清清楚楚，说可以隐藏转发按钮。

[

![](https://www.freebytes.net/wp-content/uploads/2020/05/image-18.png)

]()

其实，这个所谓的“隐藏转发按钮”，只是“不设置转发”的意思。在不调用这个函数 wx.hideShareMenu 的时候，你通过点击右上角按钮，可以看到“转发”功能——

[

![](https://www.freebytes.net/wp-content/uploads/2020/05/image-20.png)

]()

如果调用了这个函数，你会看到转发被禁止了——

[

![](https://www.freebytes.net/wp-content/uploads/2020/05/image-21.png)

]()

![](https://www.freebytes.net/wp-content/uploads/2020/05/image-22.png)

所以说，官方误人啊，别想隐藏这个按钮了。