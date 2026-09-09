---
title: "在win10上单机部署Hadoop-3.2.1"
slug: win10-hadoop-3-2-1
date: 2022-10-31 10:30:30
category: 大数据
status: published
views: 1389
---

windows10可以单机部署hadoop3.2.1，本文介绍下具体的操作步骤。

一、从gitee上拉取项目 [https://gitee.com/freebytes/win10-hadoop3.git]() 到本地，项目已经准备好所有的必须文件，不必去下载winutils。先新建两个环境变量：

 1、HADOOP_HOME  G:\hadoop-3.2.1\ 
 2、JAVA_HOME   你的java目录

然后在环境变量Path中加入： %JAVA_HOME%\bin 、 %JAVA_HOME%\bin 

二、修改具体配置文件。

1. %HADOOP_HOME%\etc\hadoop\hdfs-site.xml
2. %HADOOP_HOME%\etc\hadoop\core-site.xml
3. %HADOOP_HOME%\etc\hadoop\mapred-site.xml
4. %HADOOP_HOME%\etc\hadoop\yarn-site.xml

上面这四个文件，关于绝对路径的值，全都改成自己电脑上的路径。

修改 %HADOOP_HOME%\etc\hadoop hadoop-env.cmd的JAVA_HOME:

```
set JAVA_HOME=" 你的java目录"
```

三、进入 HADOOP_HOME 目录，然后用管理员身份打开powershell，执行命令 

```
hdfs namenode -format 
上一步成功后再执行：
 .\sbin\start-dfs.cmd 
 上一步成功后再执行：
 .\sbin\start-yarn.cmd 
```

全部启动后，就可以通过 [http://localhost:9870/dfshealth.html]() 访问hdfs，通过 [http://localhost:8088/cluster]() 访问yarn。