---
title: "html的锚链接"
slug: html-maolianjie
date: 2020-06-11 05:01:27
category: 前端
tags: [前端, 前端]
summary: "html中的a标签可以跳转到不同的页面，这叫超链接；但其实也可以跳转到同页面或不同页面的某个特定节点，这种跳转方式就叫锚链接。"
status: published
views: 1572
---

html中的a标签可以跳转到不同的页面，这叫超链接；但其实也可以跳转到同页面或不同页面的某个特定节点，这种跳转方式就叫锚链接。实现锚链接的方式非常简单，如下代码：

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
    <!--<div><a href="test.html#app">跳转到app页面</a> </div>-->
    <div><a href="#app">跳转到app页面</a> </div>
    <div style="height:1500px; width: 800px; background-color: #6de3bf"></div>
    <div  id="app" ><h1>app页面</h1></div>
</body>
</html>
```

点击“跳转到app页面”，页面就下滑到id为“app”的节点：“app页面”。如果要实现不同页面特定节点的跳转， 只需要把href="#app改成xxx.html#app即可。