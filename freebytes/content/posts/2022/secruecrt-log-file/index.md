---
title: "SecrueCRT 将日志保存到外部文件"
slug: secruecrt-log-file
date: 2022-06-17 03:08:03
category: Linux
status: published
views: 1435
---

secureCRT默认将日志输出到界面上，但是当日志很多的时候，前面的日志就会被冲掉了，只有将其保存在外面的文本上，才可以回看所有的日志。

打开界面，按步骤进行设置：

[

![](https://www.freebytes.net/wp-content/uploads/2022/06/image.png)

]()

[

![](https://www.freebytes.net/wp-content/uploads/2022/06/image-1.png)

]()

2、4步对应的设置文本如下：

```
E:\linux-log\%S\%Y%M%D-%h%m%s.log （要先建立好父级文件夹linux-log）
[%Y%M%D_%h:%m:%s.%t ]
[%h:%m:%s:%t]
```

设置后，点击ok，会弹出下方的对话框，选择第二个选项，则对全局session起作用。

[

![](https://www.freebytes.net/wp-content/uploads/2022/06/image-2.png)

]()

最后一步，打开左上角的File选项，在展开的列表中，勾选Log Session，在使用linux服务器时，就可以打印日志到外部文件了。

[

![](https://www.freebytes.net/wp-content/uploads/2022/06/16554351901.png)

]()