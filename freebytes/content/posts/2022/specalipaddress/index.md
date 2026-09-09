---
title: "特殊IP地址与IP地址分类"
slug: specalipaddress
date: 2022-01-13 06:28:17
category: 网络
tags: [网络, 网络]
status: published
views: 2019
---

Address Block                    Name                              RFC                        
 0.0.0.0/8                        "This host on this network"       [RFC1122], section 3.2.1.3 

 10.0.0.0/8                       Private-Use                       [RFC1918]                  

 100.64.0.0/10                    Shared Address Space              [RFC6598]                  

 127.0.0.0/8                      Loopback                          [RFC1122], section 3.2.1.3 

 169.254.0.0/16                   Link Local                        [RFC3927]                  

 172.16.0.0/12                    Private-Use                       [RFC1918]                  

 192.0.0.0/24[2]                  IETF Protocol Assignments         [RFC6890], section 2.1     

 192.0.0.0/29                     IPv4 Service Continuity Prefix    [RFC7335]                  

 192.0.0.8/32                     IPv4 dummy address                [RFC7600]                  

 192.0.0.9/32                     Port Control Protocol Anycast     [RFC-ietf-pcp-anycast-08]  

 192.0.0.170/32, 192.0.0.171/32   NAT64/DNS64 Discovery             [RFC7050], section 2.2     

 192.0.2.0/24                     Documentation (TEST-NET-1)        [RFC5737]                  

 192.31.196.0/24                  AS112-v4                          [RFC7535]                  

 192.52.193.0/24                  AMT                               [RFC7450]                  

 192.88.99.0/24                   Deprecated (6to4 Relay Anycast)   [RFC7526]                  

 192.168.0.0/16                   Private-Use                       [RFC1918]                  

 192.175.48.0/24                  Direct Delegation AS112 Service   [RFC7534]                  

 198.18.0.0/15                    Benchmarking                      [RFC2544]

 198.51.100.0/24                  Documentation (TEST-NET-2)        [RFC5737]                  

 203.0.113.0/24                   Documentation (TEST-NET-3)        [RFC5737]                  

 240.0.0.0/4                      Reserved                          [RFC1112], section 4       

255.255.255.255/32               Limited Broadcast                 [RFC919], section 7

2.1     
 192.0.0.0/29                     IPv4 Service Continuity Prefix    [RFC7335]                  

 192.0.0.8/32                     IPv4 dummy address                [RFC7600]                  

 192.0.0.9/32                     Port Control Protocol Anycast     [RFC-ietf-pcp-anycast-08]  

 192.0.0.170/32, 192.0.0.171/32   NAT64/DNS64 Discovery             [RFC7050], section 2.2     

 192.0.2.0/24                     Documentation (TEST-NET-1)        [RFC5737]                  

 192.31.196.0/24                  AS112-v4                          [RFC7535]                  

 192.52.193.0/24                  AMT                               [RFC7450]                  

 192.88.99.0/24                   Deprecated (6to4 Relay Anycast)   [RFC7526]                  

 192.168.0.0/16                   Private-Use                       [RFC1918]                  

 192.175.48.0/24                  Direct Delegation AS112 Service   [RFC7534]                  

 198.18.0.0/15                    Benchmarking                      [RFC2544]

 198.51.100.0/24                  Documentation (TEST-NET-2)        [RFC5737]                  

 203.0.113.0/24                   Documentation (TEST-NET-3)        [RFC5737]                  

 240.0.0.0/4                      Reserved                          [RFC1112], section 4       

255.255.255.255/32               Limited Broadcast                 [RFC919], section 7

A类地址  0.0.0.0~127.255.255.255

B类地址  128.0.0.0~191.255.255.255

C类地址  192.0.0.0~223.255.255.255

D类地址  224.0.0.0~239.255.255.255 //多播

E类地址  240.0.0.0~247.255.255.255 //保留和研究

组播地址：

[组播]()组可以是永久的也可以是临时的。[组播]()组地址中，有一部分由官方分配的，称为永久组播组。永久[组播]()组保持不变的是它的ip地址，组中的成员构成可以发生变化。永久[组播]()组中成员的数量都可以是任意的，甚至可以为零。那些没有保留下来供永久[组播]()组使用的ip组播地址，可以被临时组播组利用。

224.0.0.0~224.0.0.255为预留的[组播]()地址(永久组地址)，地址224.0.0.0保留不做分配，其它地址供[路由协议]()使用;

224.0.1.0~224.0.1.255是公用[组播]()地址，可以用于Internet;

224.0.2.0~238.255.255.255为用户可用的[组播]()地址(临时组地址)，全网范围内有效;

239.0.0.0~239.255.255.255为本地管理[组播]()地址，仅在特定的本地范围内有效。

列表如下:

224.0.0.0 基准地址(保留)

224.0.0.1 所有主机的地址 (包括所有[路由器]()地址)

224.0.0.2 所有[组播]()[路由器]()的地址

224.0.0.3 不分配

224.0.0.4 dvmrp[路由器]()

224.0.0.5 所有ospf路由器

224.0.0.6 ospf DR/BDR

224.0.0.7 st[路由器]()

224.0.0.8 st主机

224.0.0.9 rip-2[路由器]()

224.0.0.10 Eigrp[路由器]()

224.0.0.11 活动代理

224.0.0.12 dhcp 服务器/中继代理

224.0.0.13 所有pim[路由器]()

224.0.0.14 rsvp封装

224.0.0.15 所有cbt[路由器]()

224.0.0.16 指定sbm

224.0.0.17 所有sbms

224.0.0.18 vrrp