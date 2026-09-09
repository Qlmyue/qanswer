---
title: "ISO模型常用排错命令及工具"
slug: %e5%b8%b8%e7%94%a8%e6%8e%92%e9%94%99%e5%91%bd%e4%bb%a4%e5%8f%8a%e5%b7%a5%e5%85%b7
date: 2020-04-04 16:04:33
category: 寥寥随笔
status: published
views: 2841
---

## **路由交换排错**

ISO模型排错诀窍：

从上到下：网络层正常，从应用层到网络层；
从下到上：网路层异常，从物理层到网络层。

**ping命令**

ping -a 源IP 目的IP
ping -a 10.0.234.20 8.8.8.8    在核心交换机上测试，
**测试指定网段访问目标是否正常。**

ping -s 包大小 -c数量 目的IP
ping -s 1500 -c 100 8.8.8.8    
**测试链路质量**

ping -s 包大小 -f  目的IP #-f禁止分片 MTU=1500(default)
ping -s 1472 -f 8.8.8.8
 禁止分片ftp能ping，能访问，但是不能传输文件，有可能是服务器禁止分片。 

 <H3C>debugging ip icmp acl 2001
<H3C>terminal monitor
<H3C>terminal debugging
acl basic 2001rule 0 permit source 1.1.1.3 0
查看是否收到ping报文，acl可以过来不需要的icmp报文interface LoopBack 0IP add+IP**当被限制某个IP才能访问某些服务的时候可以配合ping -a来进行网络测试，虚拟接口地址配置成可以访问的地址。此某个IP可以是内部网络的任意地址**

[H3c-vlan-interface1]ip address dhcp-alloc
在交换机创建一个自动获取IP地址的三层交口，可以远程测试DHCP是否正常。在无线排错中使用，同样可以用到客户端不能获得dhcp地址的情况。 

 display diag采集设备诊断信息，save在设备flash上，然后，用ftp下载到本地。打400技术支持必备。 

## **   防火墙 **

防火墙的排错难点在于域间策略和绘画状态都会影响到业务通断。

主要策略：
1、检查路由表，常规的路由排错思路
2、防火墙是否产生会话
3、会话出口是否正确重点操作：查看会话表端口测试软件 SocketTool在PC和服务器上都打开软件进行测试，查看是不是防火墙问题，逐条测试。 

## 

软件工具

 UltraCompare
对比文本差异，可以方便对比设备当前配置与以嵌备份配置的差异。网络维护后网络异常可与备份文件对比，快速查找不到地方。

Iperf
 测试网速，客户+服务器配合使用 

标杆神器
H3C综合类工具 
[http://www.h3c.com/cn/Home/Agreement/default.htm?t=%E6%A0%87%E6%9D%86%E7%9A%84%E7%A5%9E%E5%99%A8V6.0.2&s=4835124]()