---
title: "搭建起maven私服仓库后，要做哪些配置？"
slug: build-maven-nexus-start
date: 2022-09-05 10:43:06
category: java
tags: [java, java, maven]
status: published
views: 1189
---

用docker去搭建nexus，做maven私服，非常的方便，一行命令搞定：

```
docker run -tid -p 8083:8081 --name nexus -e NEXUS_CONTEXT=nexus -v /nexus3/nexus-data:/nexus-data  sonatype/nexus3
```

登录进入nexus界面，

[

![](https://www.freebytes.net/wp-content/uploads/2022/09/image-1024x481.png)

]()

基本上我们只需要这四个仓库，而除了aliyun，其他都是nexus自带的。特别注意的是他们的type，aliyun的type是proxy，代表它是个代理仓库；maven-public的type是group，代表它实际上是一个仓库组，由组员组成，它本身不是真的仓库，不负责存储数据。

那么我们需要建一个aliyun的仓库。

[

![](https://www.freebytes.net/wp-content/uploads/2022/09/image-1-1024x287.png)

]()

[

![](https://www.freebytes.net/wp-content/uploads/2022/09/image-2-1024x513.png)

]()

进入页面后，填写name为aliyun，proxy的代理地址写为：

```
http://maven.aliyun.com/nexus/content/groups/public
```

即阿里云的maven镜像仓库。

如此即可。

然后再进入到maven-public的仓库设置页面，把成员选上：

[

![](https://www.freebytes.net/wp-content/uploads/2022/09/image-3-1024x707.png)

]()

这就代表着，如果maven指定了maven-public仓库，那么实际上负责提供组件下载的，依次是maven-releases、maven-snapshots、aliyun。

那么只需要在maven的setting.xml中这么配置一下即可：

```
<repositories>
   <repository>
         <id>central</id>
         <name>local maven-public</name>
         <url>http://172.161.1.90:8083/repository/maven-public/</url>
         <layout>default</layout>
	 <releases>
            <enabled>true</enabled>
            <updatePolicy>always</updatePolicy>
            <checksumPolicy>warn</checksumPolicy>
          </releases>		  
          <snapshots>
	    <enabled>true</enabled>
            <updatePolicy>always</updatePolicy>
            <checksumPolicy>warn</checksumPolicy>
	  </snapshots>
   </repository>
</repositories>
```

那么如何上传自己的组件呢？

这四个仓库中，maven-public和aliyun的type都不支持上传组件，只有maven-releases和maven-snapshots可以上传，这是一种相对主流的配置。

我们在项目的pom文件中，需要配置以下代码，才可以发布我们自己的组件：

```
    <distributionManagement>
        <repository>
            <id>central</id>
            <url>http://172.161.1.90:8083/repository/maven-releases/</url>
        </repository>
        <snapshotRepository>
            <id>central</id>
            <url>http://172.161.1.90:8083/repository/maven-snapshots/</url>
        </snapshotRepository>
    </distributionManagement>
```

注意，url必须是对得上号的。

如果不太明白，可以具体看下maven的setting相关配置：

https://www.freebytes.net/it/java/maven-setting-xml-node.html