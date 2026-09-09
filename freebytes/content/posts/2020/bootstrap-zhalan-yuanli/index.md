---
title: "Bootstrap栅栏系统中的响应式原理探索"
slug: bootstrap-zhalan-yuanli
date: 2020-05-09 10:42:05
category: 前端
tags: [Bootstrap, 前端, 前端]
summary: "Bootstrap的栅栏系统，是如何等份切分div的，又是如何实现响应式机制的？我写了一份代码，简单模拟了下Bootstrap的实现机制"
status: published
views: 1765
---

### 栅栏系统与响应式

Bootstrap的栅栏式布局，可以应用在任何一个合适的div上，它将这个div当成是可以划分成12个相同宽度的列的集合。开发者可以在这个div下，书写内嵌div，这些内嵌div可以根据需要占据12个列中的1个或多个列。如下的代码中，是一个简单的示例：

```
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-1">.col-md-1</div>
            <div class="col-md-2">.col-md-2</div>
            <div class="col-md-3">.col-md-3</div>
            <div class="col-md-6">.col-md-6</div>
        </div>
    </div>
```

![](https://www.freebytes.net/wp-content/uploads/2020/05/image-1-1024x225.png)

样式.row对应的div元素，相当于是占据了12个列的父级容器，而.col-md-1占据了其中1份，.col-md-2占据了其中两份...当屏幕收缩时，每一个 .col-md-*对应的div的宽度都会变小，当缩小到一个固定值（ 992px ）以下时，屏幕就会变成这样：

[

![](https://www.freebytes.net/wp-content/uploads/2020/05/image-2.png)

]()

每一个.col-md.*对应的div的宽度都变成了100%，于是原本是横向排列的元素，变成了纵向排列的元素。这也就是**响应式**的一个基本应用。

那么，像这样的一个响应式功能，bootstrap到底是如何实现的呢？

### 原理分析

首先，需要了解下响应式应用的一个基本要素——媒体查询，一个css的功能，能够根据屏幕大小的变化，调用不同的样式。

```
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style type="text/css">
        body {
            background-color: chartreuse;
        }
        @media screen and (max-width: 992px) {
            body {
                background-color: lightpink;
            }
        }
    </style>
</head>
<body>

</body>
```

如上代码中，@media screen and (max-width: 992px) 便是媒体查询的应用，意思是，当屏幕宽度<=993px时，body的背景颜色将变成粉色，而在此之前，body的背景颜色是chartreuse。

响应式框架里，基本都离不开这个媒体查询的功能，Bootstrap也不例外。那么，文中开头提到的，.row元素的响应式变化，其实在原理上大致可分为这几个步骤：

1. 为每一个.col-md-*对应的div元素分配宽度
2. 使得每一个 .col-md-*对应的div元素并列显示
3. 使用媒体查询，判断屏幕宽度小于992px时，重新调整 .col-md-*对应的div元素的宽度为100%；
4. 使用媒体查询，判断屏幕宽度小于992px时，重新调整 .col-md-*对应的div元素的位置； 

这里说到的992px，其实是根据.col-md-*中的md决定的，Bootstrap对不同的屏幕配置了不同的样式类：

```
.col-xs-* 超小屏幕 手机 (<768px)
.col-sm-* 小屏幕 平板 (≥768px)
.col-md-* 中等屏幕 桌面显示器 (≥992px)
.col-lg-* 大屏幕 大桌面显示器 (≥1200px)
```

另外，使每一个 .col-md-*对应的div元素并排显示的方式，不止一种，但是Bootstrap使用的是float布局的方式，让每一个元素都浮动起来，并且各自占据不同的百分比。这样子，当屏幕缩小到一定程度时，因为浮动元素宽度变成100%的原因，其位置也就自然地变成纵向排列了。

### 实现简单响应式机制

基于此，我写了一份代码，在不使用Bootstrap代码的情况下简单模拟了下Bootstrap的实现机制——

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name=”viewport” content=”width=device-width, initial-scale=1,
          maximum-scale=1,minimum-scale=1,user-scalable=no″>
    <title>简单响应式</title>
    <style type="text/css">
        body {
            padding: 0;
            margin: 0;
        }
        .container-fluid {
            width: 100%;
            box-sizing: border-box;
        }
        .row > div {
            height: 100px;
            line-height: 100px;
            box-sizing: border-box;
            border: 1px solid #CCCCCC;
            background-color: lightblue;
            text-align: center;
        }
        .col-md-1,.col-md-2,.col-md-3,.col-md-6{
            width:100%;
        }
        @media screen and (min-width: 992px) {
            .col-md-1 {
                width: 8.33333333%;
                float: left;
            }
            .col-md-2 {
                width: 16.6666666%;
                float: left;
            }
            .col-md-3 {
                width: 25%;
                float: left;
            }
            .col-md-6 {
                width: 50%;
                float: left;
            }
        }
    </style>
</head>
<body>
<div class="container-fluid">
    <div class="row">
        <div class="col-md-1 custom">.col-md-1</div>
        <div class="col-md-2 custom">.col-md-2</div>
        <div class="col-md-3 custom">.col-md-3</div>
        <div class="col-md-6 custom">.col-md-6</div>
    </div>
</div>
</body>
</html>
```

效果如下：

[

![](https://www.freebytes.net/wp-content/uploads/2020/05/image-3.png)

]()中等屏幕以上

[

![](https://www.freebytes.net/wp-content/uploads/2020/05/image-4.png)

]()中等屏幕以下