---
title: "史上最精简的springboot项目搭建"
slug: dajian-springboot
date: 2019-09-19 07:37:18
category: java
tags: [java, java, springboot]
summary: "本文旨在演示搭建最为精简的springboot的项目，当然精简不代表功能少，只是尽量用最少的步骤最少的代码搭建更多功能的springboot项目。"
status: published
views: 1786
---

### 简介

本文旨在演示搭建最为精简的springboot的项目，当然精简不代表功能少，只是尽量用最少的步骤最少的代码搭建更多功能的springboot项目。

### springboot搭建第一版

主要分三步：建立maven项目，导入相关依赖，创建启动类，完毕。
建立maven项目就不必说了，大家都会的吧。
第二步中，我们只需要导入一个依赖——

```
<properties>
    <springboot.version>2.1.3.RELEASE</springboot.version>
</properties>

<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
        <version>${springboot.version}</version>
    </dependency>
</dependencies>
```

版本号可以自选。
第三步，在顶级包目录下创建最精简的启动类——

```
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.*run*(Application.class);
    }
}

```

所谓顶级包目录，就是当你所有代码都写在名为net.freebytes的包及其子包下时，net.freebytes就是顶级包目录。这样一来，就成功创建了一个端口为8080的最简单的springboot项目，如图：

![](https://www.freebytes.net/wp-content/uploads/2019/09/image-8.png)

### springboot项目搭建第二版

第一版的springboot，不能够自定义端口号，也不能打包，这绝对是不能满足企业应用的，只能用于日常测试。第二版中，稍作完善。

第一步，还是创建maven项目。

第二步，导入相关依赖，并增加springboot的maven插件，用于支持打包操作。

```
<properties>
    <springboot.version>2.1.3.RELEASE</springboot.version>
</properties>

<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
        <version>${springboot.version}</version>
    </dependency>
</dependencies>

<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <version>${springboot.version}</version>
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

第三步，在resources下，增加application.properties文件，并写上server.port=8080，自定义端口号。

![](https://www.freebytes.net/wp-content/uploads/2019/09/image-9.png)

第四步，精简启动类——

```
@EnableAutoConfiguration
@ComponentScan
public class Application {
    public static void main(String[] args) {
        SpringApplication.*run*(Application.class);
    }
}
```

如上代码，启动类的注解相比明明增加了一个，但是我为什么说精简启动类呢？
其实，网上博客写的springboot的启动类例子，总是有不一样的注解，这篇写这个、那篇写那个，很少人仔细说清楚，下一篇文章就全面讲解下《[SpringBoot启动类注解全析]()》。