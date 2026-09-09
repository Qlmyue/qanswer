---
title: "完全卸载MySQL 与重装"
slug: mysql-anzhuang
date: 2019-08-25 07:04:31
category: java
status: published
views: 2075
---

在安装mysql时，遇到了一些难以描述的问题，于是一直在卸载、重装这个软件，花了一个晚上的时间，终于成功了。为了日后有需要时方便查看，就写下这篇博客用来记录详细过程。

### 1. 把MySQL服务停止掉

![](https://oscimg.oschina.net/oscnet/1974ff4ec33bcdb4a8c6cfcade3117d6e72.jpg)

### 2.进入控制面板卸载mysql相关的一切服务

![](https://oscimg.oschina.net/oscnet/e93077d3350f8e2e48735e2b90f6d894aaf.jpg)

### 3.删除干净之后很舒服，但是还不行 还要删除文件

![](https://oscimg.oschina.net/oscnet/a5a180e76a468cd1f257f5ce9cd74c5e4df.jpg)

这个ProgramData文件夹是隐藏的，注意打开隐藏文件查看设置，把图中MySQL文件夹删除

![](https://oscimg.oschina.net/oscnet/2a46f8e726845e50ebfeb6ba9a6c3bf586e.jpg)

这个也删除。

### 4.删除文件之后清理注册表。

按下win+r 输入regedit，进入注册表

删除以下几个文件

计算机\HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\EventLog\Application\MySQLD Service

![](https://oscimg.oschina.net/oscnet/addd687d4024128c9ef207d4f5a811e7e02.jpg)

其实，不同操作系统 mysql的注册表文件可能存在不一样的地方，所以最好的方式是

![](https://oscimg.oschina.net/oscnet/135c569a3e958d76ee86abbc66334c8acaa.jpg)

直接搜索 查找跟mysql、mysqld相关的文件夹删掉就可以了. 删除文件夹就行, 其他不用管.

### 5.好了,开始悲哀的重装吧

[https://dev.mysql.com/downloads/windows/installer/8.0.html]()  mysql下载地址

![](https://oscimg.oschina.net/oscnet/b3f1d3867962a4c1462d95cd6bc42a82ae6.jpg)

我下的是

![](https://oscimg.oschina.net/oscnet/bd9f9d8b543624c19ff83c89fa7ed7e583a.jpg)

双击msi文件.

看操作:

![](https://oscimg.oschina.net/oscnet/da0ba1f5529e925cfade91d635ca315608f.jpg)

![](https://oscimg.oschina.net/oscnet/49b513360fe91973addfcc287e909d120e6.jpg)

![](https://oscimg.oschina.net/oscnet/fbfcec4def6100041d0a0f80598969f771c.jpg)

我只要一个server就够了, 其他都不用. 因为我有navicat.

![](https://oscimg.oschina.net/oscnet/f07856355cb94ae2b514d2c00351bdc1b5c.jpg)

![](https://oscimg.oschina.net/oscnet/23de38a4ca51f279c8fe59e5f3775086ddb.jpg)

![](https://oscimg.oschina.net/oscnet/aed63be7be39afb2bdda942540da8716682.jpg)

![](https://oscimg.oschina.net/oscnet/24c845f0ca1406f562dc92ead97ae5b211b.jpg)

![](https://oscimg.oschina.net/oscnet/7a106ac08e3d270eb7183c4ab1104d987d0.jpg)

注意 , 这里 , 我选择传统的认证方式 , 主要是因为用Navicat连接方便 . 

![](https://oscimg.oschina.net/oscnet/f4ecedb681257d9e9871cd39b8459af45dd.jpg)

输入root用户的密码

![](https://oscimg.oschina.net/oscnet/459f5ac79bc2af8f38bdfa1e907a70a4487.jpg)

![](https://oscimg.oschina.net/oscnet/7c94ac31cef97069eb2dd08de55d2474a05.jpg)

![](https://oscimg.oschina.net/oscnet/910ae82e0942ced3eb292ecffbcc0243b64.jpg)

![](https://oscimg.oschina.net/oscnet/8aa12f5b0bc7b2f8d1eeb6a66e3064ccc44.jpg)

成功了!

### 6.此时会有个mysql client的程序 请打开

其实我明明只选了装server啊 , 不知道为啥它自动帮我装了客户端 .

![](https://oscimg.oschina.net/oscnet/78b5b97815a3653fa0380543284c53820e7.jpg)

输入之前设置的root密码

就可以进入mysql了

![](https://oscimg.oschina.net/oscnet/4e67f51c0d82196e9272b21f61d4f1c9935.jpg)

### 7.这时候我就可以用Navicat连接了

![](https://oscimg.oschina.net/oscnet/be596729cc12ad11d89d615fe4fa773a624.jpg)

### 8.嘿嘿 , 终于完了!