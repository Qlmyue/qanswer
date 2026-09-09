---
title: "使用spring-boot-dependencies搭建springboot项目"
slug: spring-boot-dependencies
date: 2019-12-05 05:34:37
category: java
tags: [java, java, springboot]
summary: "搭建springboot项目可以不用spring-boot-starter-parent，而选择spring-boot-dependencies"
status: published
views: 4032
---

### 使用spring-boot-starter-parent

一般搭建springboot项目时都需要使用parent依赖，方便快捷的引入诸多的构件：

```
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.1.3.RELEASE</version>
</parent>
<dependencies>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
 </dependency> 
</dependencies>
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <executions>
                <execution>
                    <goals>
                        <goal>repackage</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

一般的，pom文件只需要如此就可以启动、打包springboot项目。

且看看这个spring-boot-starter-parent的pom里面都包含了啥——

```
<properties>
    <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
    <java.version>1.8</java.version>
    <resource.delimiter>@</resource.delimiter>
    <maven.compiler.source>${java.version}</maven.compiler.source>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.target>${java.version}</maven.compiler.target>
</properties>
<build>
    <resources>
        <resource>
            <filtering>true</filtering>
            <directory>${basedir}/src/main/resources</directory>
            <includes>
                <include>**/application*.yml</include>
                <include>**/application*.yaml</include>
                <include>**/application*.properties</include>
            </includes>
        </resource>
        <resource>
            <directory>${basedir}/src/main/resources</directory>
            <excludes>
                <exclude>**/application*.yml</exclude>
                <exclude>**/application*.yaml</exclude>
                <exclude>**/application*.properties</exclude>
            </excludes>
        </resource>
    </resources>
    <pluginManagement>
        <plugins>
         ...诸多构件声明
         </plugins>
  </pluginManagement>
</build>
```

这里面的插件声明非常的多，有些用户不一定喜欢使用。因此可以使用另外一种手动声明的方式——

### 使用spring-boot-dependencies

通过引入spring-boot-dependencies，也可以完成springboot项目的构建，但是这就要求显示的声明spring-boot-maven-plugin插件，pom文件如下——

```
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-dependencies</artifactId>
            <version>${springboot.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>

<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <executions>
                <execution>
                    <goals>
                        <goal>repackage</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

如此，依然可以对springboot项目进行启动、打包等操作。