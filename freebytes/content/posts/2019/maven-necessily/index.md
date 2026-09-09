---
title: "Maven必要的知识点"
slug: maven-necessily
date: 2019-08-18 14:19:27
category: java
tags: [java, java, maven]
summary: "maven是每个java开发者都离不开的工具。以往每次使用maven都只是使用到了一些基本的、现成的知识，对maven本身缺少系统性的认知，也不知道一些必要的知识点。这几天查看了相关的一些资料，整理了一下Maven的基础和必要的知识点。"
status: published
views: 1813
---

### 一、简介

    maven是每个java开发者都离不开的工具。以往每次使用maven都只是使用到了一些基本的、现成的知识，对maven本身缺少系统性的认知，也不知道一些必要的知识点。这几天查看了相关的一些资料，整理了一下Maven的基础和必要的知识点。

### 二、Maven的安装和配置

    maven其实是一个基于jvm平台的工具，因此安装maven前首先保证java的环境变量是可用的。下载maven软件包解压缩之后，有如下目录：

![](https://oscimg.oschina.net/oscnet/782d71bedd7c9c5a6a65a1d42ca1401cace.jpg)

    把bin目录所在的完整目录配置到PATH环境变量，此时就可以在控制台使用mvn命令了。尝试执行mvn -v  如若正常输出版本后即成功。

    bin目录下包含了mvn运行的脚本，当中的mvn.bat脚本是windows的脚本，在命令行输入任何一条mvn命令时，都是在调用这个mvn脚本。conf目录下包含了一个很重要的文件settings.xml。这个文件定义了maven本地仓库、远程仓库、http代理、私服等等。

### 三、~/m2

    ~指的是用户目录，如C:\Users\liXiao\，这个m2目录是maven默认的存放setting.xml文件和repository仓库文件的地址。但是一般的，我们会使用conf目录下的setting文件，并在这个setting文件里面配置自己的本地仓库，如在文件中修改localRepository属性：

```
<!--设置自己的maven本地仓库-->
<localRepository>E:\MyRepository</localRepository>
```

### 四、Maven坐标

```
<groupId>com.alibaba</groupId>
<artifactId>druid</artifactId>
<version>1.1.8</version>
<packaging>jar</packaging>
```

 这样一个熟悉的pom文件的一组配置，就表示一个maven仓库中实际存在的durid的jar包。

![](https://oscimg.oschina.net/oscnet/04b3ceedef4e71a0d9abef35b78fff787dc.jpg)

    像这样一组配置，叫做maven的坐标定义。

### 五、构建maven项目

目录结构如下

![](https://oscimg.oschina.net/oscnet/929c071d78e249159fee115ad7821fc54b5.jpg)

pom文件如下

```
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.yue</groupId>
    <artifactId>study-maven</artifactId>
    <version>1.0-SNAPSHOT</version>

    <dependencies>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.apache.commons</groupId>
            <artifactId>commons-lang3</artifactId>
            <version>3.7</version>
            <scope>compile</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.7.0</version>
                <configuration>
                    <source>1.8</source>
                    <target>1.8</target>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-shade-plugin</artifactId>
                <version>1.2.1</version>
                <executions>
                    <execution>
                        <phase>package</phase>
                        <goals>
                            <goal>shade</goal>
                        </goals>
                        <configuration>
                            <transformers>
                                <transformer implementation="org.apache.maven.plugins.shade.resource.ManifestResourceTransformer">
                                    <mainClass>com.yue.Hello</mainClass>
                                </transformer>
                            </transformers>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</project>
```

    hello.java如下：

```
/**
 * Created by 千里明月 on 2018/10/30.
 */
public class Hello {
    public static void main(String[] args) {
        //
        Hello hello = new Hello();
        hello.sayhello();

    }

    public void sayhello(){
        System.out.println("hello world");
    }
}
```

### 六、依赖

**1.依赖配置：**

```
<depndencies>
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.12</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

**2.依赖范围：**

**test**：指的是测试范围有效，在编译打包、运行时都不会使用这个依赖。本maven项目中，使用了junit依赖，但是范围是test，因此只能在测试目录src/test/java下的java文件中使用，hello.java不能使用。

**compile：**指的是编译范围有效，在编译、测试、打包、运行时都会将依赖存储进去。如果没有指定，就会默认使用该依赖范围。例如：hibernate jar包。

**provided**：在编译和测试的过程有效，最后生成包时不会加入，运行时自然也没效果。例如：servlet-api，因为servlet-api，tomcat等web服务器已经存在该jar包了，如果再打包可能会有冲突。

**runtime：**在测试、运行的时候依赖，在编译的时候不依赖。例如：JDBC驱动，项目代码只需要jdk提供的jdbc接口，只有在执行测试和运行项目的时候才需要实现jdbc的功能。

**system：**系统依赖范围。该依赖范围与provided所表示的依赖范围一致，对于编译和测试有效，但在运行时无效。只是使用system范围依赖时必须通过systemPath元素显式地指定依赖文件的路径。

**import(Maven 2.0.9及以上)：**导入依赖范围。

**3.传递性依赖：**

Maven的依赖是具有传递性的，比如A->B,B->C,那么A间接的依赖于C，这就是依赖的传递性，其中A对于B是第一直接依赖，B对于C是第二直接依赖，C为A的传递性依赖。

**4.依赖排除：**

传递性依赖会给项目隐式的引入很多依赖，这极大的简化了项目依赖的管理，但是有些时候这种特性也会带来问题，它可能会把我们不需要的jar包也引入到了工程当中，使项目结构变得更复杂。或者你想替换掉默认的依赖换成自己想要的jar包，这时候就需要用到依赖排除。

如：

```
<dependency>    
     <groupId>org.springframework</groupId>  
     <artifactId>spring-core</artifactId>  
     <version>3.2.8</version>  
     <exclusions>  
           <exclusion>      
                <groupId>commons-logging</groupId>          
                <artifactId>commons-logging</artifactId>  
           </exclusion>  
     </exclusions>  
</dependency>
```

**5.可选依赖：**

当项目A依赖项目B时，B中的某个依赖不想被A使用，那么也可以通过配置<optional>true</optional>完成

```
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-lang3</artifactId>
    <version>3.7</version>
    <scope>compile</scope>
    <optional>true</optional>
</dependency>
```

### 七、生命周期

maven有三个内置的生命周期：**默认（default）**，**清洁（clean）**和**站点（site）**。在**默认（default）**的生命周期处理你的项目部署，将**清洁（clean）**的生命周期处理项目的清理，而**网站（site）**的生命周期处理你的项目站点文档的创建。

这些构建生命周期中的每一个由构建阶段的不同列表定义，其中构建阶段表示生命周期中的阶段。

例如，**默认（default）**的生命周期包括以下阶段（注意：这里是简化的阶段）：

- **验证（validate）** - 验证项目是否正确，所有必要的信息可用
- **编译（compile）** - 编译项目的源代码
- **测试（test）** - 使用合适的单元测试框架测试编译的源代码。这些测试不应该要求代码被打包或部署
- **打包（package）** - 采用编译的代码，并以其可分配格式（如JAR）进行打包。
- **验证（verify）** - 对集成测试的结果执行任何检查，以确保满足质量标准
- **安装（install）** - 将软件包安装到本地存储库中，用作本地其他项目的依赖项
- **部署（deploy）** - 在构建环境中完成，将最终的包复制到远程存储库以与其他开发人员和项目共享。

这些生命周期阶段（以及此处未显示的其他生命周期阶段）依次执行，以完成默认生命周期。给定上述生命周期阶段，这意味着当使用默认生命周期时，Maven将首先验证项目，然后尝试编译源代码，运行这些源代码，打包二进制文件（例如jar），运行集成测试软件包，验证集成测试，将验证的软件包安装到本地存储库，然后将安装的软件包部署到远程存储库。

换句话说，在生命周期里面阶段是连续的，在不出错的前提下，比如执行**打包（package）**时就一定是执行了**测试（test）**之后再执行。

### 八、聚合与继承

当项目A中聚合了项目B和项目C时，聚合配置代码：

```
<groupId>com.yue</groupId>
<artifactId>A</artifactId>
<packaging>pom</packaging>
<version>1.0-SNAPSHOT</version>
<modules>
    <module>B</module>
    <module>C</module>
</modules>
```

其中module的路径为相对路径。

当编译项目A时，会先进行A的编译，再编译B，再编译C。

继承配置代码：

```
<parent>
    <artifactId>study-maven</artifactId>
    <groupId>com.yue</groupId>
    <version>1.0-SNAPSHOT</version>
</parent>
<artifactId>study-maven-child</artifactId>
```

继承为了消除重复，我们把很多相同的配置提取出来，例如：grouptId，version等.

当项目A继承项目B时，A可以直接引用B的依赖而不需要配置dependency。

当编译子项目时，会先进行父项目的编译。

像这样一种确定各个模块的编译顺序的机制，在maven中叫做**反应堆**。

### 继承与传递依赖的关系和区别

    这是很重要的知识点。

**继承： **

1.     父项目的<package>属性必须是pom
2. 子项目能够直接引用父项目的依赖，不需要在自己pom中声明。
3. 子项目能够直接使用父项目的properties属性，不需要在自己pom中声明。
4. 子项目能够引用父项目中声明的dependencyManagement下的依赖版本，如父项目中有：

```
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>commons-io</groupId>
            <artifactId>commons-io</artifactId>
            <version>2.5</version>
        </dependency>
    </dependencies>
</dependencyManagement>
```

    可在子项目中忽略版本号引用：

```
<dependencies>
    <dependency>
        <groupId>commons-io</groupId>
        <artifactId>commons-io</artifactId>
    </dependency>
</dependencies>
```

**传递依赖：**

情景：项目A依赖于项目B，项目B依赖于项目C。

1.  项目A中的配置：

```
<dependencies>
    <dependency>
        <groupId>com.yue</groupId>
        <artifactId>B</artifactId>
        <version>1.0</version>
    </dependency>
</dependencies>
```

    如此，项目A可以直接使用项目B的依赖，不需要其他配置。

2.  项目C和B的<package>属性必须是jar

3.  项目A不能使用项目B和C项目的properties属性

4.  项目A不能享用B、C项目中声明的dependencyManagement。