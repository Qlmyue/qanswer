---
title: "Docker命令大全"
slug: docker-cmd
date: 2019-12-25 03:31:59
category: Linux
summary: "总结了一下docker中使用的高频命令和基本命令"
status: published
views: 2203
---

## 镜像

> 

images_name 表示镜像名
con_name表示容器名

| 获取镜像  |  docker pull images_name  |
| 查看已有的docker镜像  |  docker images  |
| 查看镜像列表   |  docker search  images_name   |
| 删除镜像  |  docker rmi image_name   |
| 修改镜像名  |  docker tag imageid name:tag  |
| 导出本地镜像   |  docker save -o image_name.tar image_name |
| 加载本地镜像 | docker load -i image_name.tar |
| 将容器构建成docker镜像   |  docker commit  con_name images_name  |

## 容器

> 

con_name表示容器名 

 image_name 表示镜像名

| 启动一个容器 | docker run image_name |
| 停止/启动/重启 一个容器  | docker stop/start/restart con_name |
| 查看所有的容器  | docker ps -a |
| 编辑容器名称 | docker rename 原容器名 新容器名  |
| 查看正在运行的容器  | docker ps  |
| 删除容器  | docker rm con_name |
| 看容器的端口映射情况  | docker port con_name |
| 动态查看容器日志  | docker logs -f con_name |
| 动态查看最后100行的容器日志  | docker logs -f  --tail 100 con_name |
| 查看容器pid  | docker top con_name |
| 查看docker容器IP  | docker inspect con_name| grep IPAddress |
| 进入容器  | docker exec -it con_name  /bin/bash   |
| 退出容器  | 方法一 exit
方法二 ctrl+p && ctrl+q (一起按，注意顺序，退出后容器依然保持启动状态) |
| 创建一个容器，放入后台运行，把物理机80端口映射到容器的80端口 | docker run -d -p 81:80 image_name
#-p 参数说明
-p hostPort:containerPort
-p ip:hostPort:containerPort
-p ip::containerPort
-p hostPort:containerPort:udp |

## 网络

> 

net_name 网络名

| 查看所有网络 | docker network ls |
|  创建一个docker网络  | docker network create -d bridge
 net_name |
|  启动容器时关联网络 | docker run  --network= net_name  -itd 
--name=con_name image_name |
|  将容器添加到my_net2网络  | docker network connect  net_name  con_name |

## 文件

> 

host_path  主机文件路径
container_path 容器文件路径
containerID 容器id，用容器名也可以

|  从主机复制到容器  | sudo docker cp host_path containerID:container_path |
|  从容器复制到主机  | sudo docker cp containerID:container_path host_path |

## 日志

|  刚运行就退出的容器，查看日志  | docker start con_name -ia |
|  动态查看容器日志  | docker logs -f con_name |
|  动态查看最后100行的容器日志 | docker logs -f  --tail=100 con_name |

## 查看配置

| 查看容器配置 | docker inspect con_name |