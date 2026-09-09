---
title: "用visual studio开发C语言项目"
slug: visual-studio-c-start
date: 2020-01-18 09:24:05
category: C语言
summary: "用于编写C语言项目的IDE有很多，visual studio是一个不错的选择。"
status: published
views: 2077
---

## 简介

用于编写C语言项目的IDE有很多，visual studio是一个不错的选择。

## 新建项目

第一步，打开visual studio软件，并新建一个c++项目。

[

![](https://www.freebytes.net/wp-content/uploads/2020/01/image-5.png)

]()

[

![](https://www.freebytes.net/wp-content/uploads/2020/01/image-6.png)

]()

选择visuall c++，windows控制台应用程序，并新建。

[

![](https://www.freebytes.net/wp-content/uploads/2020/01/image-7.png)

]()

## 修改c++项目

第二步，将c++项目修改成c项目。在页面的右边，可以看到"解决方案资源管理器"，将里面的头文件和源文件删除。

[

![](https://www.freebytes.net/wp-content/uploads/2020/01/image-8.png)

]()

右键点击"源文件"，创建新的项。

[

![](https://www.freebytes.net/wp-content/uploads/2020/01/image-10.png)

]()

选择c++文件，但是在名称那里，将文件名改为hello.c，记住，一定要以.c为后缀，不要用原来的.cpp。

[

![](https://www.freebytes.net/wp-content/uploads/2020/01/image-11.png)

]()

右键单击testC，选择属性，打开——

[

![](https://www.freebytes.net/wp-content/uploads/2020/01/image-9.png)

]()

选择C/C++，将SDL检查关掉。

[

![](https://www.freebytes.net/wp-content/uploads/2020/01/image-12.png)

]()

选择预编译头，设置不使用预编译头。设置完之后，点击应用、确定。

[

![](https://www.freebytes.net/wp-content/uploads/2020/01/image-13.png)

]()

在刚刚新建的hello.c文件中，写入第一段打码——

```
#include <stdio.h>
int main() {
	printf("hello world\n");
	system("pause");
}
```

如下，点击本地windows调试器，运行代码。

[

![](https://www.freebytes.net/wp-content/uploads/2020/01/image-14.png)

]()

效果如下：

[

![](https://www.freebytes.net/wp-content/uploads/2020/01/image-15.png)

]()