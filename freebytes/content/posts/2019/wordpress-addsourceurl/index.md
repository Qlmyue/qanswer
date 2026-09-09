---
title: "wordpress自动为文章添加原文链接"
slug: wordpress-addsourceurl
date: 2019-09-27 08:32:36
category: 技术博客
summary: "网上太多没有素质的博主肆意复制别人辛苦劳作的成品，来给自己的网站增加流量。因此，很多博主都会给自己的文章添加原文链接。但是，每次写文章都要写原文链接会显得很麻烦，所以这里推荐一种使得wordpress自动为每篇文章添加原文链接的方式。"
status: published
views: 2783
---

网上太多没有素质的博主肆意复制别人辛苦劳作的成品，来给自己的网站增加流量。因此，很多博主都会给自己的文章添加原文链接。但是，每次写文章都要写原文链接会显得很麻烦，所以这里推荐一种使得wordpress自动为每篇文章添加原文链接的方式。

做法：进入主题编辑器，打开content-single.php，或者是single.php，只要找到<?php the_content(); ?>即可。这条语句输出的是文章的内容，所以可以在这语句上面或者下面，输入你的原文链接申明：

```
<p>原创文章出自明月工作室，如转载请注明本文链接:<a href="<?php the_permalink() ?>"title="<?php the_title(); ?>"><?php the_permalink() ?></a></p>
```

如此，更新文件，即可。