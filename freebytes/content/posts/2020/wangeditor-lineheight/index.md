---
title: "wangEditor增加行高和具体字号功能"
slug: wangeditor-lineheight
date: 2020-05-12 04:44:05
category: 前端
tags: [前端, 前端]
summary: "wangEditor是一个很轻巧的富文本编辑器，本文就介绍一下如何给wangEditor增加行高功能和具体字号的功能。"
status: published
views: 7603
---

### 简介

wangEditor是一个很轻巧的富文本编辑器，这个编辑器在v2版本的时候，带有行高功能，但是在最新的V3版本，却去掉了这个很基本的功能。另外，编辑器的字号功能一直都有很大的限制，只能设置“x-small、small、normal、large”这样的字号，不能设置“12px、14px、16px”这样的具体字号。 

大家可能很奇怪，这么简单的功能，为什么作者不随手加上去呢？其实在文本编辑器里实现精准的字号调节是一件相当难的事情，行高功能不能说难，但是要做到代码方面的精炼依然是很难的。

wangeditor最后的更新到如今都两年了，作者没再更新了，实在是遗憾。但好在这个项目开源了，我可以自己改源码，为这个编辑器增加一些其他的基本功能。本文就介绍一下如何给wangEditor增加行高功能和具体字号的功能。

### 增加功能

增加行高和具体字号功能的方式，我这里有两种，一种是简单的，直接改发布好的js文件，引用时直接使用这个改好的js文件；一种是改源代码，然后重新发布成自己的npm组件，项目直接使用该组件。

第一种方式，我直接提供改好的js和测试文件吧：
 [https://www.freebytes.net/wp-content/uploads/files/test-wangeditor.rar]() 

第二种方式，需要去我的git上获取源代码：
[https://github.com/18826243776/wangEditor.git]()

clone下来后，用开发工具打开，结构是这样的：

[

![](https://www.freebytes.net/wp-content/uploads/2020/05/image-12.png)

]()wangeditor项目

可以看到，release文件夹下面，就是打包好的js等文件。src文件夹就是源代码部分，其中我在src/js/menus/模块下增加了lineHeight和lineFontSize两个模块，分别表示行高、具体字号功能，里面有已经写好的代码。下下来后，可以用命令“npm run win-example”运行demo，然后在浏览器输入localhost:3000/index.html访问——

[

![](https://www.freebytes.net/wp-content/uploads/2020/05/image-13.png)

]()

以下这三个图标分别是，字号、具体字号、行高功能。（因为我懒得改样式了，所以三个功能共用一个图标）

[

![](https://www.freebytes.net/wp-content/uploads/2020/05/image-14.png)

]()

运行无误后，可将release下的文件清空，然后运行命令“npm run release”，执行打包任务。值得一提的是，这个具体字号的功能，现在还有些缺陷，它只能对选中文字所在的整行文字起作用，不能精准调节到行内的部分文字。所以我叫它“段落字号”。

[

![](https://www.freebytes.net/wp-content/uploads/2020/05/image-17.png)

]()

### 发布自己的组件

既然已经有打包好之后的文件了，那么写一个适当的package.json就可以发布自己的组件包了。

可将源码中的release文件夹和package.json文件直接复制到一个新的文件夹下，然后修改package.json的信息，

[

![](https://www.freebytes.net/wp-content/uploads/2020/05/image-15.png)

]()用于发布的文件夹

[

![](https://www.freebytes.net/wp-content/uploads/2020/05/image-16.png)

]()修改后的package.json

然后，在当前文件夹下，运行命令：

```
##设置仓库为私有仓库（如果没有私有仓库，就不需要设置）
npm config set registry  http://192.168.21.21:9001/
##登录账号
npm adduser
##发布组件
npm publish
##可以下载组件测试是否发布成功
npm install my-wangeditor
```