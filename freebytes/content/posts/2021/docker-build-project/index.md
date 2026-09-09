---
title: "docker打包项目镜像，并批处理上传"
slug: docker-build-project
date: 2021-06-15 08:14:12
category: java
tags: [docker, java, java]
status: published
views: 1695
---

需要在开发的项目根目录下，放一个Dockerfile文件，内容如下：

```
FROM adoptopenjdk:8u275-b01-jdk-openj9-0.23.0-focal
COPY ./ssmp-starter.jar ./app.jar
RUN ln -snf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo 'Asia/Shanghai' > /etc/timezone
ENTRYPOINT ["java","-Xmx1068m","-Xms1068m","-jar","./app.jar"]
```

然后放一个批处理文件docker.bat，内容如下：

```
@echo off

SET version=1.0.0

echo =========  正在构建jar包=================
call mvn clean package -Dmaven.test.skip=true --settings D:\apache-maven-3.3.9\conf\settings.xml

echo ===========创建tmp目录当做docker上下文===
mkdir tmp
copy Dockerfile tmp/Dockerfile
copy starter\target\ssmp-starter-1.0.jar  tmp\ssmp-starter.jar

echo ===========正在构建镜像===================
cd tmp
docker build -t yours.harbor.com:5000/test/ssmp:%version%  .

echo ===========正在上传镜像===================
docker push yours.harbor.com:5000/test/ssmp:%version%

echo ===========删除tmp目录====================
del /a /f /q *.*
cd ..
rd /s/q tmp

pause
```

要注意，不要直接使用Dockerfile文件构建镜像，要使用批处理文件，双击它就可以自动完成镜像构建与上传的操作。

批处理的逻辑是这样的：在当前目录生成一个tmp目录，将jar包和Dockerfile文件拷贝过去，然后进入tmp目录执行构建镜像的指令docker build。

之所以没有基于项目根目录构建镜像，是因为docker build指令，是先将当前目录的所有文件都打包发送到docker服务端，然后服务端完成镜像构建操作的。基于tmp目录构建镜像，可以最大程度的避免多余文件的发送。