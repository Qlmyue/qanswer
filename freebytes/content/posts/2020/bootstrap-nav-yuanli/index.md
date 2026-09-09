---
title: "Bootstrap响应式导航条的实现原理"
slug: bootstrap-nav-yuanli
date: 2020-05-11 03:15:32
category: 前端
tags: [Bootstrap, 前端, 前端]
summary: "导航栏的响应式变化，必定是基于媒体查询和浮动布局的，除此之外，必然是使用了CSS的一个重要属性：display:none"
status: published
views: 2757
---

###  Bootstrap官方导航栏 

Bootstrap官方导航栏组件的实现效果，是这样的：

[

![](https://www.freebytes.net/wp-content/uploads/2020/05/image-5.png)

]()小屏幕及以上（ >=768px）

[

![](https://www.freebytes.net/wp-content/uploads/2020/05/image-7.png)

]()  超小屏幕 手机（<768px） 

可见，屏幕收缩前，导航栏的每个导航项都横向排列在同一行内；屏幕收缩后， 最右端，出现了一个按钮（toggle）， 点击toggle按钮后，发现导航栏整体移动到了下一行，每个导航项变成纵向排列，各自占据100%的宽度。这样，就完成了从PC端到手机端屏幕的响应式变化。

那么，像这样的一个响应式功能，bootstrap到底是如何实现的呢？结合[上篇文章]()的知识，很容易知道，导航栏的响应式变化，必定是基于媒体查询和浮动布局的，问题是它怎么移动到下一行，那个toggle按钮又是如何出现在最右上角的？

### 原理分析

看了一下Bootstrap导航栏组件的应用代码，提取了关键部分截图如下：

[

![](https://www.freebytes.net/wp-content/uploads/2020/05/image-8.png)

]()Bootstrap导航栏部分

看代码可知，toogle按钮本身就存在于html代码内，并非使用js代码动态添加上去的，但是在大屏幕时，是看不到这个按钮的，所以，这部分必然是使用了CSS的一个重要属性：display:none，实现了按钮的隐藏。那么，整体的实现原理就大概能猜出来了：

1. 首先让“Brand”和“toggle按钮”布局在屏幕最上方，导航项布局在其下面。
2. Brand浮动在最左边， toggle 浮动在最右边。隐藏 toggle 。
3. 将导航项设置为浮动，每项宽度设置为能够并列显示在Brand和toogle之间的宽度。
4. 根据媒体查询，当屏幕收缩到固定值时，显示 toggle ，同时隐藏导航项。
5. 点击toggle时， 调整每个导航项的宽度为百分百，并显示导航项。 

### 自定义响应式导航栏实现

基于此，在不使用bootstrap代码的情况下，我模拟了一份简单的实现代码（为了方便省略了toggle按钮的点击事件）：

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>自定义导航条</title>
    <style type="text/css">
        .link {
            font-size: 24px;
            background-color: #f5f3e8;
            height: 50px;
            line-height: 50px;
            text-align: center;
            float: left;
            margin-right: 20px;
            display: none;
        }

        .brand {
            float: left;
            margin-right: 20px;
            font-size: 24px;
            background-color: #6bf5dd;
            height: 50px;
            line-height: 50px;
        }

        .toggle {
            font-size: 24px;
            float: right;
            background-color: #d1e9f5;
            height: 50px;
            line-height: 50px;
            display: block;
        }

        .contain {
            border: 1px solid #6bf5dd;
            box-sizing: border-box;
            overflow: hidden;
        }

        @media screen and (min-width: 768px) {
            .link {
                width: 10%;
                display: block;
            }

            .toggle {
                display: none;
            }
        }
    </style>
    <script type="text/javascript">
        function changeNav() {
            var links = document.getElementsByClassName('link');
            for (var i = 0; i < links.length; i++) {
                links[i].style.width='100%';
                links[i].style.display='block';
            }
        }
    </script>
</head>
<body>
<div class="contain">
    <div class="brand">Brand</div>
    <button class="toggle" onclick="changeNav()">toggle</button>
    <div class="link">Link</div>
    <div class="link">Link</div>
    <div class="link">Link</div>
    <div class="link">Link</div>
    <div class="link">Link</div>
</div>
</body>
</html>
```

效果如下：

[

![](https://www.freebytes.net/wp-content/uploads/2020/05/image-9.png)

]()较大屏幕

[

![](https://www.freebytes.net/wp-content/uploads/2020/05/image-10.png)

]()小屏幕，点击前

[

![](https://www.freebytes.net/wp-content/uploads/2020/05/image-11.png)

]()小屏幕，点击后