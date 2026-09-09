---
title: "Maven的setting.xml文件各节点解析"
slug: maven-setting-xml-node
date: 2022-09-05 09:28:02
category: java
tags: [java, java, maven]
status: published
views: 1259
---

### localRepository

本地文件系统的maven仓库地址，可配置为：

```
<localRepository>D:/MyRepository</localRepository>
```

## repository

代表一个maven仓库的配置，下面配置了一个id为central的仓库以及它的url。它同时支持releases和snapshots的jar包。这种配置一般说明，central不是个真正的仓库，而是一个仓库组，它其实由maven-releases和maven-snapshots两个仓库组成。注意，这里最重要的配置是id和url，id必须唯一。

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

url的值，也就是maven程序pull组件时的地址。

### servers

代表一组server的集合，每个server都记录着一个账户密码，id必须唯一。这个server需要配合repository使用。比如，第二个server的id是central，代表了它配置了访问id为central的repository的用户名和密码。如果目标repository没有公开，且没有为repository配置用户名和密码，那是不可访问的。

```
<server>
      <id>test1</id>
      <username>root</username>
      <password>123456</password>
</server>

<server>    
      <id>central</id>    
      <username>root</username>
      <password>123456</password>  
</server>    
```

### mirrors

一组mirror的集合，一个mirror代表的是一个代理的仓库地址。 这里面的url代表的也是一个仓库地址，这跟 repository 里面配置的url，有什么区别呢？ 

```
 <mirror>     
      <id>nexus-releases</id>     
      <mirrorOf>central</mirrorOf>     
      <url>http://120.48.212.63:8089/repository/maven-releases/</url>     
 </mirror>    
```

这里面的mirrorOf，它描述的是一个代理规则。这个值是central，跟我们刚才配置的repository的id一致，就代表着，当程序试图从id为central的repository中去pull组件时，会被id为nexus-releases的mirror所代理，url：http://120.48.212.63:8089/repository/maven-releases/ 会替代 repository 中原本的url。

规则有很多种，比如：

```
//它会代理所有的repository 
<mirrorOf>*</mirrorOf>  
//除了id为public的repository，其他所有repository都代理
<mirrorOf>!public,*</mirrorOf>  
```

下面这种配置组合，程序会怎么pull组件呢？

```
 <mirror>     
      <id>nexus-releases</id>     
      <mirrorOf>!central,*</mirrorOf>     
      <url>http://120.48.212.63:8089/repository/maven-releases/</url>     
 </mirror>    

<repositories>
   <repository>
         <id>central</id>
         <name>local maven-public</name>
         <url>http://172.161.1.210:8083/repository/maven-public/</url>
         ...
   </repository>
   <repository>
         <id>test1</id>
         <name>local maven-public</name>
         <url>http://172.11.13.220:8083/repository/maven-public/</url>
         ...
   </repository>
</repositories>

```

首先，这个mirror的规则是，代理除了central的所有repository。

程序pull一个组件时，会先检索第一个repository，由于它的id为central，所以会直接从这个repository的url中去pull，如果pull成功，就结束；如果该repository没有这个组件，就去检索第二个repository。

由于第二个repository的id符合代理规则，被第一个mirror代理了，那么程序就会从mirror的url中去pull组件，如果成功结束，失败就报错。

### profiles

这代表一个配置列表，在里面可以配置repository和pluginRepository、jdk属性等，需要激活才能生效，一般是这么用的：

```
  <profiles>
      <profile>
      <id>nexus</id>
      <activation>
        <jdk>1.8</jdk>
      </activation>	
      <repositories>
        <!-->配置仓库<-->
	<repository>
          ...
	</repository>	 
      </repositories>

      <pluginRepositories> 
        <!-->配置maven插件的下载仓库<-->
        <pluginRepository> 
	  ...
        </pluginRepository>     
       </pluginRepositories> 
	   
     <properties>    
	<maven.compiler.source>1.8</maven.compiler.source>    
	<maven.compiler.target>1.8</maven.compiler.target>    
<maven.compiler.compilerVersion>1.8</maven.compiler.compilerVersion>    
     </properties>

    </profile>
  </profiles>
```

激活上述配置：

```
  <activeProfiles>
        <!-->这个值要跟上面的profile的id一致<-->
	<activeProfile>nexus</activeProfile>
  </activeProfiles>
```