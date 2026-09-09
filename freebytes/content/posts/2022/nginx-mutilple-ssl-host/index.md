---
title: "Nginx1.22.1配置多个域名和多个SSL证书"
slug: nginx-mutilple-ssl-host
date: 2022-12-11 11:59:25
category: java
tags: [java, Nginx]
status: published
views: 5459
---

本文给nginx配置两个域名和证书，版本使用1.22.1，在window上实验。

首先在阿里云上，配置两个域名，解析到本机的ip，并申请两个ssl证书，下载到nginx的目录：

[

![](https://www.freebytes.net/wp-content/uploads/2022/12/image-4.png)

]()

然后，配置nginx.conf文件。

配置域名：

```
server {
    listen       80;
    server_name  www.yunying360.net www.zhixing.online;
    location / {
        root   html;
        index  index.html index.htm;
    }

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   html;
    }
}
```

启动nginx，打开浏览器，输入http://www.yunying360.net和 http:// www.zhixing.online，都可以访问到页面：

[

![](https://www.freebytes.net/wp-content/uploads/2022/12/image-5-1024x383.png)

]()

配置域名证书，完整的nginx配置文件如下：

```

#user  nobody;
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;

    server {
        listen       80;
        server_name  www.yunying360.net www.zhixing.online;
        location / {
            root   html;
            index  index.html index.htm;
        }

    
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
	
	server {
        listen       443 ssl;
        server_name  www.yunying360.net;

        ssl_certificate      D:/test/nginx-1.22.1/ssl/www.yunying360.net.pem;
        ssl_certificate_key  D:/test/nginx-1.22.1/ssl/www.yunying360.net.key;

        ssl_session_cache    shared:SSL:1m;
        ssl_session_timeout  5m;

        ssl_ciphers  HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers  on;

        location / {
            root   html;
            index  index.html index.htm;
        }
    }
	
	server {
        listen       443 ssl;
        server_name  www.zhixing.online;

        ssl_certificate      D:/test/nginx-1.22.1/ssl/www.zhixing.online.pem;
        ssl_certificate_key  D:/test/nginx-1.22.1/ssl/www.zhixing.online.key;

        ssl_session_cache    shared:SSL:1m;
        ssl_session_timeout  5m;

        ssl_ciphers  HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers  on;

        location / {
            root   html;
            index  index.html index.htm;
        }
    }

}

```

重载nginx，此时在浏览器输入：https://www.yunying360.net 或者https://www.zhixing.online，都可以访问到页面：

[

![](https://www.freebytes.net/wp-content/uploads/2022/12/image-6-1024x333.png)

]()