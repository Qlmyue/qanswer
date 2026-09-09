---
title: "Nginx开启gzip压缩配置"
slug: nginx-start-gzip-conf
date: 2023-04-20 04:34:06
category: java
tags: [java, Nginx]
status: published
views: 2367
---

```
server {
        listen 6200;
        server_name  localhost;

        gzip on;
        gzip_buffers 32 4K;
        gzip_comp_level 6;
        gzip_min_length 100;
        gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png image/x-icon;
        gzip_disable "MSIE [1-6]\.";
        gzip_vary on;

        location / {
            root   /web;
            index  index.html index.htm;
        }
        location ~ ^(.*)\/\.svn.*{
            deny all;
        }
    }

```

主要是这段配置：

gzip on;
gzip_buffers 32 4K;
gzip_comp_level 6;
gzip_min_length 100;
gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png image/x-icon;
gzip_disable "MSIE [1-6].";
gzip_vary on;