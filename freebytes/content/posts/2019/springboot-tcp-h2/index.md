---
title: "tcp模式开启远程h2数据库"
slug: springboot-tcp-h2
date: 2019-12-23 08:10:23
category: java
tags: [h2, java, java, springboot]
summary: "本文将如何使用tcp模式开启远程h2数据库服务器，并在springboot项目中连接该服务器，操作数据库。"
status: published
views: 3868
---

## 简介

本文将如何使用tcp模式开启远程h2数据库服务器，并在springboot项目中连接该服务器，操作数据库。

h2数据库一般放在本地，使用嵌入式内存模式或者本地文件模式集成到项目中，但是在团队开发中，这样使用各自独立的数据库是很不方便于测试的，因此，h2数据库也提供了一种服务器模式，使得多个项目都可以连接到此服务器，远程操作数据的增删改查，实现类似mysql服务器和其他数据库服务器的效果。

## 大体实现步骤：

1. 实现h2的tcp服务器端；
2. 在springboot中实现h2的客户端连接

## 开发h2的tcp服务端

准备依赖，这里推荐使用1.4.197版本的h2，因为最新稳定版的199版，并不支持某些操作。

```
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <version>1.4.197</version>
        </dependency>
```

h2-tcp服务实现类——

```
import org.h2.tools.Server;
import java.sql.*;
/**
 * h2数据库服务器
 */
public class H2TcpServer {
    private Server server;
    //数据库端口
    private String port = "8080";
    //数据库目录
    //数据库文件是当前目录下的freebytes文件，这里用的是相对路径，也可以使用本地绝对路径，如d://test/freebytes
    private String dbDir = "./freebytes;AUTO_SERVER=TRUE;DATABASE_TO_UPPER=FALSE;IFEXISTS=false;MVCC=true";
    //数据库用户名
    private String user = "test";
    //数据库密码
    private String password = "test";

    public void startH2Server() {
        try {
            System.out.println("启动h2...");
            server = Server.createTcpServer(new String[]{"-tcp", "-tcpAllowOthers", "-tcpPort", port}).start();
        } catch (SQLException e) {
            System.out.println("启动h2出错：" + e.toString());
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    public static void main(String[] args) {
        H2TcpServer h2 = new H2TcpServer();
        h2.startH2Server();
        //测试h2数据库
        h2.useH2();
        //停止h2数据库服务
        //h2.stopH2Server();
    }

    public void stopH2Server() {
        if (server != null) {
            System.out.println("关闭h2...");
            server.stop();
            System.out.println("关闭成功.");
        }
    }

    public void useH2() {
        try {
            String url = "jdbc:h2:tcp://localhost:" + port + "/" + dbDir;
            Class.forName("org.h2.Driver");
            Connection conn = DriverManager.getConnection(url, user, password);
            Statement stat = conn.createStatement();
            // insert data
            stat.execute("DROP TABLE IF EXISTS TEST");
            stat.execute("CREATE TABLE TEST(NAME VARCHAR)");
            stat.execute("INSERT INTO TEST VALUES('freebytes.net')");
            // use data
            ResultSet result = stat.executeQuery("select name from test ");
            int i = 1;
            while (result.next()) {
                System.out.println(i++ + ":" + result.getString("name"));
            }
            result.close();
            stat.close();
            conn.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

此时运行主类，即可跑起服务器。并在项目目录下，会生成一个数据库文件——freebytes.mv.db

## 开发h2的客户端连接

这一步其实就是怎么在springboot中集成h2，我上一篇博文中很详细地介绍了——《[springboot2.x集成H2数据库]()》，因此完全可以参照此文。但要注意的是，一定要调整一些参数，

[

![](https://www.freebytes.net/wp-content/uploads/2019/12/image-18.png)

]()

这里的spring.datasource.url应改成tcp模式的url——

```
spring.datasource.url=jdbc:h2:tcp://localhost:8080/./freebytes;AUTO_SERVER=TRUE;DATABASE_TO_UPPER=FALSE
```