---
title: "Docker部署nacos,配置外部mysql"
slug: docker-nacos-mysql
date: 2023-01-09 08:01:44
category: java
tags: [docker, java, nacos]
status: published
views: 3036
---

docker命令运行：

```
docker  run --name nacos -d 
-p 8848:8848 -p 9848:9848 -p 9555:9555 
--privileged=true  
-e JVM_XMS=128m 
-e JVM_XMX=128m 
-e MODE=standalone 
-e PREFER_HOST_MODE=hostname 
-v H:/nacos/data:/home/nacos/data 
-v H:/nacos/logs:/home/nacos/logs 
- v H:/nacos/conf/application.properties:/home/nacos/conf/application.properties nacos/nacos-server:latest
```

官方的application.properties文件如下：

```
# spring
server.servlet.contextPath=${SERVER_SERVLET_CONTEXTPATH:/nacos}
server.contextPath=/nacos
server.port=${NACOS_APPLICATION_PORT:8848}
server.tomcat.accesslog.max-days=30
server.tomcat.accesslog.pattern=%h %l %u %t "%r" %s %b %D %{User-Agent}i %{Request-Source}i
server.tomcat.accesslog.enabled=${TOMCAT_ACCESSLOG_ENABLED:false}
# default current work dir
server.tomcat.basedir=file:.
#*************** Config Module Related Configurations ***************#
spring.sql.init.platform=${SPRING_DATASOURCE_PLATFORM:mysql}
nacos.cmdb.dumpTaskInterval=3600
nacos.cmdb.eventTaskInterval=10
nacos.cmdb.labelTaskInterval=300
nacos.cmdb.loadDataAtStart=false
db.num=${MYSQL_DATABASE_NUM:1}
db.url.0=jdbc:mysql://192.168.24.222:3306/config?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useUnicode=true&useSSL=false&serverTimezone=UTC
db.user.0=root
db.password.0=12345678
### The auth system to use, currently only 'nacos' and 'ldap' is supported:
nacos.core.auth.system.type=${NACOS_AUTH_SYSTEM_TYPE:nacos}
### worked when nacos.core.auth.system.type=nacos
### The token expiration in seconds:
nacos.core.auth.plugin.nacos.token.expire.seconds=${NACOS_AUTH_TOKEN_EXPIRE_SECONDS:18000}
### The default token:
nacos.core.auth.plugin.nacos.token.secret.key=${NACOS_AUTH_TOKEN:SecretKey012345678901234567890123456789012345678901234567890123456789}
### Turn on/off caching of auth information. By turning on this switch, the update of auth information would have a 15 seconds delay.
nacos.core.auth.caching.enabled=${NACOS_AUTH_CACHE_ENABLE:false}
nacos.core.auth.enable.userAgentAuthWhite=${NACOS_AUTH_USER_AGENT_AUTH_WHITE_ENABLE:false}
nacos.core.auth.server.identity.key=${NACOS_AUTH_IDENTITY_KEY:serverIdentity}
nacos.core.auth.server.identity.value=${NACOS_AUTH_IDENTITY_VALUE:security}
## spring security config
### turn off security
nacos.security.ignore.urls=${NACOS_SECURITY_IGNORE_URLS:/,/error,/**/*.css,/**/*.js,/**/*.html,/**/*.map,/**/*.svg,/**/*.png,/**/*.ico,/console-fe/public/**,/v1/auth/**,/v1/console/health/**,/actuator/**,/v1/console/server/**}
# metrics for elastic search
management.metrics.export.elastic.enabled=false
management.metrics.export.influx.enabled=false
nacos.naming.distro.taskDispatchThreadCount=10
nacos.naming.distro.taskDispatchPeriod=200
nacos.naming.distro.batchSyncKeyCount=1000
nacos.naming.distro.initDataRatio=0.9
nacos.naming.distro.syncRetryDelay=5000
```

注意修改里面的msyql连接信息。