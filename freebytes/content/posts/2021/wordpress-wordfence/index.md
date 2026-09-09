---
title: "wordpress插件wordfence无法正常使用"
slug: wordpress-wordfence
date: 2021-04-06 06:02:22
category: 技术博客
status: published
views: 1958
---

插件无法更新、安装，以及使用，通常是因为文件权限的问题。在linux上解决wordfence无法启动的问题，可以这样做：

```
 chown -R www-data:www-data ~/wp-content/wflogs 
```