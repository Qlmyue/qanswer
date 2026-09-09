---
title: "Docker中使用bridge网络"
slug: docker-network-bridge
date: 2020-01-08 08:36:02
category: Linux
summary: "就docker而言，bridge网络允许在同一个桥接网络内的不同容器相互通信，同时隔离不在此网络内的容器。"
status: published
views: 1992
---

## bridge网络

bridge网络，也就是docker的桥接网络，可简称“网桥”。

就网络而言，网桥是一个能在不同网段之间转发流量的链路层设备。桥可以是运行在主机内核的软件设备或硬件设备。
但是就docker而言，网桥是一个软件设备，它允许在同一个桥接网络内的不同容器相互通信，同时隔离不在此网络内的容器。
Docker网桥驱动程序会自动在主机中安装、配置规则，以使不同网桥网络上的容器无法直接相互通信。

桥接网络适用于在同一Docker守护进程主机上运行的容器。
为了在不同Docker守护进程主机上运行的容器之间进行通信，可以在OS级别管理路由，也可以使用overlay network。

启动Docker时，会自动创建一个默认的桥接网络，新启动的容器将默认连接到该网络。

但是我们一般创建自己定义的桥接网络。用户定义的桥接网络优于默认bridge网络。

## 用户定义的网桥和默认网桥之间的区别

### 1. 用户定义的桥在容器之间提供更好的隔离和互操作性。

连接到同一用户定义的网桥的容器会自动将所有端口彼此公开，而不会向外界公开任何端口。这使容器化的应用程序可以轻松地彼此通信，而不会意外打开对外界的访问。

eg：以一个具有Web前端和数据库后端的应用程序作为例子。
外界需要访问Web前端（也许在端口80上），但是只有后端本身需要访问数据库主机和端口。使用用户定义的网桥，只需打开Web端口，并且数据库应用程序不需要打开任何端口，因为Web前端可以通过用户定义的网桥到达它。如果在默认网桥网络上运行相同的应用程序堆栈，则需要使用-p或--publish 标志分别打开Web端口和数据库端口。这意味着Docker主机需要通过其他方式阻止外界对数据库端口的访问。

### 2. 用户定义的网桥可在容器之间提供自动DNS解析。

在用户定义的网桥网络上，容器可以通过名称或别名相互解析。默认桥接网络上的容器只能通过IP地址相互访问，除非使用**--link**选项在容器之间手动创建连接,但这些链接需要双向创建，因此，当进行通信的容器超过两个，操作将变得很复杂。

### 3. 容器可以随时随地从用户定义的网络连接和分离。

在容器的生命周期内，您可以即时将其与用户定义的网络连接或断开连接。要从默认桥接网络中删除容器，您需要停止容器并使用其他网络选项重新创建它。

## 使用默认网桥

```
docker network ls

NETWORK ID          NAME                DRIVER              SCOPE
17e324f45964        bridge              bridge              local
6ed54d316334        host                host                local
7092879f2cc8        none                null                local
```

其中bridge就是默认的桥接网络。现在启动两个容器， 由于未指定任何 `--network`标志，因此容器将连接到默认`bridge`网络。 

```
docker pull alpine 

docker run -dit --name alpine1 alpine ash

docker run -dit --name alpine2 alpine ash
```

此时，可以 检查`**bridge**`网络连接了哪些容器：

```
docker network inspect bridge

"Containers": {
            "602dbf1edc81813304b6cf0a647e65333dc6fe6ee6ed572dc0f686a3307c6a2c": {
                "Name": "alpine2",
                "EndpointID": "03b6aafb7ca4d7e531e292901b43719c0e34cc7eef565b38a6bf84acf50f38cd",
                "MacAddress": "02:42:ac:11:00:03",
                "IPv4Address": "172.17.0.3/16",
                "IPv6Address": ""
            },
            "da33b7aa74b0bf3bda3ebd502d404320ca112a268aafe05b4851d1e3312ed168": {
                "Name": "alpine1",
                "EndpointID": "46c044a645d6afc42ddd7857d19e9dcfb89ad790afb5c239a35ac0af5e8a5bc5",
                "MacAddress": "02:42:ac:11:00:02",
                "IPv4Address": "172.17.0.2/16",
                "IPv6Address": ""
            }
        },
```

此时，alpine2的ip是172.17.0.3，alpine1的ip是172.17.0.2，在两个容器里面，可以相互ping通对方的ip，但是不能ping通对方的容器名，因为默认的网桥并不提供相关的DNS解析。

## 使用用户定义的网桥网络

1、创建`alpine-net`网络。`--driver bridge`因为是默认标志，所以其实可以不用写出来。

```
docker network create --driver bridge alpine-net
```

2、此时可查看Docker的网络，发现多了一个：

```
docker network ls

NETWORK ID          NAME                DRIVER              SCOPE
e9261a8c9a19        alpine-net          bridge              local
17e324f45964        bridge              bridge              local
6ed54d316334        host                host                local
7092879f2cc8        none                null                local
```

3、将两个容器加入到alpine-net网络中：

```
docker run -dit --name alpine3 --network alpine-net alpine ash

docker run -dit --name alpine4 --network alpine-net alpine ash
```

4、此时查看alpine-net网络，发现alpine3 和alpine4已在网络中：

```
docker network inspect alpine-net

  "Containers": {
            "0a02c449a6e9a15113c51ab2681d72749548fb9f78fae4493e3b2e4e74199c4a": {
                "Name": "alpine3",
                "EndpointID": "c83621678eff9628f4e2d52baf82c49f974c36c05cba152db4c131e8e7a64673",
                "MacAddress": "02:42:ac:12:00:02",
                "IPv4Address": "172.18.0.2/16",
                "IPv6Address": ""
            },
            "156849ccd902b812b7d17f05d2d81532ccebe5bf788c9a79de63e12bb92fc621": {
                "Name": "alpine4",
                "EndpointID": "058bc6a5e9272b532ef9a6ea6d7f3db4c37527ae2625d1cd1421580fd0731954",
                "MacAddress": "02:42:ac:12:00:04",
                "IPv4Address": "172.18.0.4/16",
                "IPv6Address": ""
            },
```

5、进入其中一个容器，ping另一个容器的ip或者容器名，都可以ping通。

## 管理用户定义的网桥

1、 创建用户定义的网桥网络 

```
docker network create 网络名
```

2、 使用该docker network rm命令删除用户定义的网桥网络。如果容器当前已连接到网络， 请先断开它们的连接 。

```
docker network rm 网络名
```

3、要将运行中的容器与用户定义的网桥断开连接

```
docker network disconnect 网络名 容器名
```

4、要将运行中的容器连接到现有的用户定义的网桥

```
docker network connect 网络名 容器名
```

5、将容器连接到用户定义的网桥创建新容器时，可以指定一个或多个--network标志。本示例将Nginx容器连接到my-net网络。它还将容器中的端口80发布到Docker主机上的端口8080，以便外部客户端可以访问该端口。连接到my-net 网络的任何其他容器都可以访问该my-nginx容器上的所有端口，反之亦然。

```
 docker create --name my-nginx \
  --network my-net \
  --publish 8080:80 \
  nginx:latest
```

## 注意

尽量不要在同一网络中，使多个容器的内部端口出现相同的情况，否则在容器互联时，会出现莫名的错误。比如：nginx容器使用 -p 8081:80 ，而wordpress容器使用-p 80:80，nignx使用桥接网络代理到wordpress时，会出现无法代理的情况。

另外，推荐一篇更具实用性的docker容器互联的文章：[docker网络组建]()