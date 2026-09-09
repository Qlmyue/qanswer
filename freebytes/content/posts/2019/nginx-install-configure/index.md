---
title: "Nginx从安装到配置和监控"
slug: nginx-install-configure
date: 2019-11-28 08:36:39
category: java
tags: [java, linux, Linux, Nginx]
summary: "本文讲述nginx在CentOS系统下的安装和配置过程，以及如何监控nginx 的工作状态 "
status: published
views: 2453
---

本文讲述nginx在CentOS系统下的安装和配置过程。nginx下载地址  [http://nginx.org/en/download.html]() ，理应下载稳定版本的，中间为linux版，右边为windows版本。

[

![](https://www.freebytes.net/wp-content/uploads/2019/11/image-2.png)

]()

### 安装所需环境

1、安装gcc：安装 nginx 需要先将官网下载的源码进行编译，编译依赖 gcc 环境

> 

　　yum install gcc-c++

2、 安装pcre pcre-devel：PCRE(Perl Compatible Regular Expressions) 是一个Perl库，包括 perl 兼容的正则表达式库。nginx 的 http 模块使用 pcre 来解析正则表达式，所以需要在 linux 上安装 pcre 库，pcre-devel 是使用 pcre 开发的一个二次开发库。nginx也需要此库

> 

　　yum install -y pcre pcre-devel

3、安装zlib：zlib 库提供了很多种压缩和解压缩的方式， nginx 使用 zlib 对 http 包的内容进行 gzip ，所以需要在 Centos 上安装 zlib 库

> 

　　yum install -y zlib zlib-devel

4、安装OpenSSL：OpenSSL 是一个强大的安全套接字层密码库，囊括主要的密码算法、常用的密钥和证书封装管理功能及 SSL 协议，并提供丰富的应用程序供测试或其它目的使用。nginx 不仅支持 http 协议，还支持 https（即在ssl协议上传输http），所以需要在 Centos 安装 OpenSSL 库

> 

　　yum install -y openssl openssl-devel

### 将安装包上传、解压

> 

　　tar -zxvf nginx-1.10.1.tar.gz

### 配置、编译、安装

进入nginx的解压目录，自定义配置：

```
./configure   \
--prefix=/home/freebytes/work/imoon/nginx      \
--with-http_stub_status_module   \
--with-http_ssl_module
```

源码的安装一般由3个步骤组成：配置（configure）、编译（make）、安装（make install）。 Configure是一个可执行脚本，它有很多选项，  这里的--prefix是将nginx的安装目录配置到自定义目录（该目录会被自动创建），安装完成后 该软件所有的文件都被复制到这个目录，方便软件移植（复制文件夹即可）、卸载（删除文件夹即可）和其他方面的维护。--with-http_stub_status_module是增加监控模块，--with-http_ssl_module是增加ssl模块。

输入 make  编译

输入 make install  安装

安装好之后，所有的文件都在/home/freebytes/work/imoon/nginx下面，进入查看：

![](https://www.freebytes.net/wp-content/uploads/2019/11/image-3.png)

此时，在当前目录下，输入 ./sbin/nginx -V ，查看：

![](https://www.freebytes.net/wp-content/uploads/2019/11/image-4.png)

可以查看到，之前的配置信息。

### 运行

在运行nginx之前，还需要处理一下配置文件，输入 vi  conf/nginx.conf ，编辑：

![](https://www.freebytes.net/wp-content/uploads/2019/11/image-5.png)

将第一行文字替换为：user freebytes;   （freebytes是我的用户名），保存。
之后，进入sbin目录，运行命令

 ./nginx               打开浏览器访问：http://localhost:80，成功。

./nginx -s stop    等待nginx处理任务完毕，停止nginx进程

./nginx -s quit    先查出进程ID，再使用kill命令强制杀掉进程

./nginx -s reload   重新加载nginx，不用重启nginx，使配置文件生效（若修改了nginx.conf）

### 开放端口

此时的nginx只能在linux服务器内部访问，如需开放外部访问，还需要开放端口，这里使用firewall永久开放端口：

1、运行命令：

```
firewall-cmd --get-active-zones
```

运行完成之后，可以看到zone名称，如下：

![](https://www.freebytes.net/wp-content/uploads/2019/11/image-7.png)

2、执行如下命令：

```
firewall-cmd --zone=public --add-port=80/tcp --permanent
```

3、重启防火墙，运行命令：

```
firewall-cmd --reload
```

4、查看端口号是否开启，运行命令：

```
firewall-cmd --query-port=80/tcp
```

## 监控nginx 工作状态  

由于刚才已经配置了--with-http_stub_status_module模块，所以增加监控功能，只需要在nginx.conf的server块中增加如下配置：

```
location ~ /status{
                   stub_status on;
                   access_log off;
            }
```

 ./nginx -s reload  重新加载nginx，然后在浏览器输入： [http://192.168.50.38/status]() ，就可以看到nginx的状况

![](https://www.freebytes.net/wp-content/uploads/2019/11/image-8.png)

Active connections:  #当前的活动连接数（包括Waiting状态的连接）； 
accepts:  #从Nginx启动到此时一共已经接收的连接数； 
handled:  #已经被处理完成的连接数； 
requests:  #客户端发来的总请求数； 
Reading:  #Nginx正在读取请求头的连接数；
Writing:  #Nginx处于向客户端发送响应报文的连接数； 
Waiting:  #等待客户端发送新请求的空闲连接数；