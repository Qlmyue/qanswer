---
title: "wordpress主题,调整默认博文字体大小"
slug: update-fontsize
date: 2019-08-15 01:08:47
category: 技术博客
status: published
views: 5300
---

### 问题

相信有些朋友在使用wordpress的时候，会遇到一个问题。那就是在写文章时字体的大小默认是“常规”，如下：

[

![](https://www.freebytes.net/wp-content/uploads/2019/08/image-5.png)

]()

而且，你在编辑页面上，看到的效果还行，但是预览时或者发布后，看到的正文字体会非常小或者偏小。于是你得针对每个区块，调整字号，这样就会很麻烦。

[

![](https://www.freebytes.net/wp-content/uploads/2019/08/image-6.png)

]()

要解决这个问题，可以从主题样式方面入手，就是改变主题在显示文章正文时所使用的的字体样式。对于不同的主题，可能有不一样的方式，所以这里我把自己修改自家主题样式的方法分享出来，希望对大家有用。

### 解决

1、首先，在首页上或者其他页面上找到自己发布的一篇文章，任何一篇都可以，打开开发者调试工具，同时打开element和styles，然后用红色箭头所指的右上角的指针工具点击页面博客正文内容，就可以定位到element和styles上的相关内容。

[

![](https://www.freebytes.net/wp-content/uploads/2019/08/image-7-1024x374.png)

]()

 这时候将鼠标移动至styles上的内容，

[

![](https://www.freebytes.net/wp-content/uploads/2019/08/image-8-1024x335.png)

]()

我这里移动到了 .entry-content 上面，发现左边的正文区域被选中了，说明这个style作用于整个正文部分的样式，于是我在上面加了一句    font-size: 1.2rem;
然后左边的字体自然就变化了，rem是一个单位，类似px，但是具有响应式的效果，具体可以了解一下css中rem、em的知识。

2、至此我们找到了样式名并确认过，接下来就得去主题编辑器中修改了。在style.css中找到  .entry-content  ，添加 font-size: 1.2rem ；或者 font-size:30px;看你自己需要。 

3、保存样式表，刷新主页，再点进去看看你的文章是不是字体大小变化了。