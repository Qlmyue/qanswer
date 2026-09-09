---
title: "Docker部署ftp服务器"
slug: docker-ftp
date: 2020-01-08 08:55:06
category: Linux
summary: "利用Docker快速部署ftp服务器"
status: published
views: 2187
---

## 简介

利用Docker可以快速部署ftp服务器

## 实现步骤

1、下载镜像

```
docker pull fauria/vsftpd
```

2、运行容器

```
docker run -d -v /home/freebytes/:/home/vsftpd \
-p 21:21 -p 21100-21110:21100-21110 \
-e FTP_USER= freebytes \
-e FTP_PASS= freebytes \
-e PASV_ADDRESS=172.17.10.5 \
-e FILE_OPEN_MODE=0755 \
-e LOCAL_UMASK=022 \
-e PASV_MIN_PORT=21100 \
-e PASV_MAX_PORT=21110 \
-e PASV_ADDRESS_ENABLE=true \
--name ftp-freebytes --restart=always fauria/vsftpd
```

3、参数解释：

```
-v /home/freebytes/:/home/vsftpd  挂载文件目录
-e FTP_USER= freebytes            设置ftp服务器用户名
-e FTP_PASS= freebytes            设置ftp服务器用户名 
-e PASV_ADDRESS=172.17.10.5 设置ftp服务器地址，若设置成127.0.0.1，外部无法访问
-e FILE_OPEN_MODE=0755  -e LOCAL_UMASK=022  设置ftp上传的文件的读写属性为755
-e PASV_ADDRESS_ENABLE=true      设置ftp服务器使用被动模式
```

## 浏览器或者文件资源管理器访问路径：

ftp://172.17.10.5