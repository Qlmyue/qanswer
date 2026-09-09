---
title: "用idea+maven，开发传统JSP项目"
slug: idea-maven-jsp-project
date: 2021-01-07 06:52:22
category: java
tags: [java, java, jsp]
status: published
views: 4349
---

现在的javaWeb开发一般是基于springboot，直接使用idea开发，使用maven管理jar包。但在以前，使用传统的jsp技术的时候，还没有idea这么好用的开发工具，也没有maven。那时候一般是用eclipse，直接下载并导入jar包的方式开发。

日前，想做一下传统tomcat项目相关的研究，就想着搭建一个传统的jsp项目回忆一下老旧的知识。于是试了一下，基于idea和maven，直接搭建jsp项目。

首先，打开idea，直接建立一个普通的maven项目，目录如下：

[

![](https://www.freebytes.net/wp-content/uploads/2020/12/image-5.png)

]()

注意要新建webapp目录。然后打开project structure设置，绑定web资源目录：

[

![](https://www.freebytes.net/wp-content/uploads/2020/12/image-6.png)

]()

点击Web之后，会弹出一个设置框，让你绑定web资源目录，要注意将路径设置成我们的webapp的绝对路径：

[

![](https://www.freebytes.net/wp-content/uploads/2020/12/image-7-1024x492.png)

]()

这时，webapp目录的图标会发生变化，并且自动生成了web.xml文件：

[

![](https://www.freebytes.net/wp-content/uploads/2020/12/image-8.png)

]()

继续设置project stucture，配置项目的war包输出：

[

![](https://www.freebytes.net/wp-content/uploads/2020/12/image-11.png)

]()

[

![](https://www.freebytes.net/wp-content/uploads/2020/12/image-12.png)

]()

确定后，structure已经完全配置好。此时，还需要配置tomcat作为启动程序。

[

![](https://www.freebytes.net/wp-content/uploads/2020/12/image-9.png)

]()

选择一个tomcat-server，配置如下：

[

![](https://www.freebytes.net/wp-content/uploads/2020/12/image-10.png)

]()

[

![](https://www.freebytes.net/wp-content/uploads/2020/12/image-13.png)

]()

[

![](https://www.freebytes.net/wp-content/uploads/2020/12/image-14.png)

]()

到这里，就完全配置好了，这时候就可以在webapp下，新建一个index.html，然后启动项目，就能访问了。

如果想要打包成war包，那么还需要配置好maven文件，具体配置如下：

```
    <groupId>net.freebytes.tomcat</groupId>
    <artifactId>tomcat-test</artifactId>
    <version>1.0</version>
    <packaging>war</packaging>

    <build>
        <plugins>
            <!-- Compile using Java 1.8 -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.3</version>
                <configuration>
                    <source>1.8</source>
                    <target>1.8</target>
                </configuration>
            </plugin>

            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-war-plugin</artifactId>
                <version>2.6</version>
            </plugin>
        </plugins>
    </build>

    <dependencies>
        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>javax.servlet-api</artifactId>
            <version>3.0.1</version>
            <scope>provided</scope>
        </dependency>
        <dependency>
            <groupId>javax.servlet.jsp</groupId>
            <artifactId>jsp-api</artifactId>
            <version>2.1</version>
            <scope>provided</scope>
        </dependency>
    </dependencies>
```

可查看源码：[https://gitee.com/freebytes/idea-jsp-demo.git]()