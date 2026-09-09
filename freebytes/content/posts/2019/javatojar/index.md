---
title: "将普通java类打包成可执行jar包"
slug: javatojar
date: 2019-12-13 08:42:14
category: java
tags: [java, java]
summary: "一个普通的java类，只要拥有main函数，也是可以打成可执行jar包的。下面演示利用maven插件maven-shade-plugin将java类打包成可执行jar包。"
status: published
views: 1271
---

一个普通的java类，只要拥有main函数，也是可以打成可执行jar包的。下面演示利用maven插件maven-shade-plugin将java类打包成可执行jar包。

新建maven项目，至少包含一个拥有main函数的类和一个pom文件——

[

![](https://www.freebytes.net/wp-content/uploads/2019/12/image-6.png)

]()

HelloWorld如下——

```
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("https://www.freebytes.net");
        System.out.println("--欢迎来到明月工作室--");
    }
}
```

pom文件中添加maven-shade-plugin——

```
    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-shade-plugin</artifactId>
                <version>3.1.1</version>
                <executions>
                    <execution>
                        <phase>package</phase>
                        <goals>
                            <goal>shade</goal>
                        </goals>
                        <configuration>
                            <transformers>
                                <transformer
                                        implementation="org.apache.maven.plugins.shade.resource.ManifestResourceTransformer">
                                    <mainClass>net.freebytes.dabao.HelloWorld</mainClass>
                                </transformer>
                            </transformers>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>

```

如此，运行打包指令：

mvn clean package 

打包项目，生成了一个jar包：dabao-1.0-SNAPSHOT.jar。在jar包目录下运行：

java  -jar   dabao-1.0-SNAPSHOT.jar 

[

![](https://www.freebytes.net/wp-content/uploads/2019/12/image-7.png)

]()