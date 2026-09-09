---
title: "启动Doris-be服务出错，文件限制太小"
slug: doris-be-startup-problem
date: 2022-11-29 02:02:46
category: 大数据
status: published
views: 2683
---

在ubuntu20.04系统安装doris-1.1.4的时候，执行 ${DORIS_HOME}/bin/start_be.sh 启动be时，出现了一个问题：

check fd number failed, error: Internal error: file descriptors limit is too small...

日志说我文件限制太小。解决方案如下：

1、增加系统限制：

```
在 /etc/sysctl.conf 文件中设置 :
fs.file-max = 2097152
```

```
在 /etc/security/limits.conf 文件中添加:

* soft     nproc          131072    
* hard     nproc          131072   
* soft     nofile         131072   
* hard     nofile         131072
root soft     nproc          131072    
root hard     nproc          131072   
root soft     nofile         131072   
root hard     nofile         131072
```

```
在文件中 /etc/pam.d/common-session 添加：

session required pam_limits.so
```

2、重启机器：reboot

3、确认下文件限制是否被改掉：

```
执行 ulimit -n 
输出 131072

执行 ulimit -Hn
输出 131072

执行 ulimit -Sn
输出 131072
```

4、重新执行 ${DORIS_HOME}/bin/start_be.sh