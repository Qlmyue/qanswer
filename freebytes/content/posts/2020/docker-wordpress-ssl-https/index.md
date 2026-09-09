---
title: "Docker部署的wordpress，强制http请求跳转到https"
slug: docker-wordpress-ssl-https
date: 2020-01-10 03:17:33
category: 技术博客
summary: "我在配置好ssl之后，接着配置http请求强制重定向到https的时候，怎么都不成功。于是想了另一个办法。"
status: published
views: 2595
---

docker部署的wordpress，如果不使用nginx代理，直接使用容器自带的apache2服务配置ssl，其实有些麻烦。我在配置好ssl之后，接着配置http请求强制重定向到https的时候，怎么都不成功。

我是在/etc/apache2/site-enabled/000-default.conf配置文件下配置的，配置参数如下——

```
<Directory "/var/www/html">
   RewriteEngine   on
   RewriteBase /
   # FORCE HTTPS
   RewriteCond %{HTTPS} !=on
   RewriteRule ^/?(.*) [https://%](https://%25/){SERVER_NAME}/$1 [R,L]
</Directory>
```

配置不起效，网上也找不到相关的可靠的资料，于是我想直接在wordpress这一层配置重定向跳转。

刚好有个wordpress的插件Redirection，我下载安装了之后，打开配置页面——

[

![](https://www.freebytes.net/wp-content/uploads/2020/01/image.png)

]()

在site栏目页，开启了强制http到https的跳转。然后按页面下方的update按钮，更新配置。这个重定向配置有延迟，等了几分钟，再开始访问http://www.freebytes.net的时候，就跳转到了 https://www.freebytes.net。