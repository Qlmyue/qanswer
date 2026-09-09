---
title: "Guacamole 开发web端远程桌面"
slug: guacamole-web
date: 2019-08-17 10:27:30
category: java
summary: "Apache Guacamole 是无客户端的远程桌面网关。guacamole的客户端是html5 web应用程序，因此通过访问浏览器，就可以访问到远程桌面"
status: published
views: 9093
---

## **一、简介**

Apache Guacamole 是无客户端的远程桌面网关。它支持VNC,RDP,SSH等标准协议。guacamole的客户端是html5 web应用程序，因此通过访问浏览器，就可以访问到远程桌面。大家应该使用过Microsoft的mstsc，或者VNC，又或者teamviewer,这些都是基于C/S架构的远程桌面连接组件，而guacamole却做到了基于B/S的远程桌面连接。下图介绍了guacamole的整个体系：

[

![](https://oscimg.oschina.net/oscnet/218b449e7a3275eb9c177bc1961495b5f3f.jpg)

]()

这里稍作讲解，guacamole包括两大部分，guacamole-client和guacamole-server。client是一个web服务器，实现了对server的远程访问。server则实现了client和远程桌面服务的桥梁。server中包括了一个servlet容器，和一个guacd服务。准确来说，是这个guacd服务实现了对远程桌面服务的代理。例如，你的远程电脑中安装了一个vnc服务器，那么这个guacd就你能实现从guacamole到这个vnc服务器的连接，完成代理工作。一个完整的guacamole应用体系，至少应该是这样的：一个guacamole-client，一个guacamole-server, server中包括了guacd，一个远程主机的vnc服务器。当用户访问client，client则将请求发送到server，server利用guacd进行协议转化，guacd从远程主机中的vnc服务器中获取实时画面，并将其返回给server，server加工处理后返回给client，用户就能看到一个实时画面监控的页面了。

## **二、适应场景**

guacamole能够实现多方面的用途，但我主要是为了实现java-web程序的网页远程监控，监控内网中的一部小型服务器。这样子的话，我起码需要三个东西，一个web服务器，一个guacamole服务器部署在Linux上，一个vnc服务（guacamole支持不同的远程协议，rdp、vnc等，我只实现vnc）部署在远程主机上。要完成这么一个工程，需要各个方面的环境搭建，下面一一介绍。

### 安装环境：

我以centOS系统作为guacamole服务器的承载，工具使用secureCRT，通过SFTP传输文件。SFTP的基本命令如下：

```
pwd   查看远程服务器当前目录；
lpwd  查看本地系统的当前目录。
cd <dir>   将远程服务器的当前目录更改为<dir>；
lcd <dir>  将本地系统的当前目录更改为<dir>。
ls 显示远程服务器上当前目录的文件名；
ls -l  显示远程服务器上当前目录的文件详细列表；
ls <pattern> 显示远程服务器上符合指定模式<pattern>的文件名；
ls -l <pattern>  显示远程服务器上符合指定模式<pattern>的文件详细列表。
lls 显示本地系统上当前目录的文件名；
lls的其他参数与ls命令的类似。
get <file> 下载指定文件<file>；
get <pattern> 下载符合指定模式<pattern>的文件。
put <file> 上传指定文件<file>；
get <pattern> 上传符合指定模式<pattern>的文件。
progress 切换是否显示文件传输进度。
mkdir <dir> 在远程服务器上创建目录；
lmkdir <dir> 在本地系统上创建目录。
```

## **三、安装jdk**

部署guacamole需要jdk和tomcat，先下载jdk8，下载地址 [http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html]()

[

![](https://oscimg.oschina.net/oscnet/4a42612e79aa5ed29fd772864be833fd1cd.jpg)

]()

将文件通过SFTP传入CentOS，tar -zvxf 命令解压，重命名为java8。然后，配置环境变量。

输入： sudo vim /etc/profile  编辑环境变量。

在/etc/profile文件末尾加入： 

```
export JAVA_HOME=java8的路径（可以进入java8目录使用命令“pwd”查看）
export PATH=$JAVA_HOME/bin:$PATH 
export CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar 
```

编辑好之后，保存退出。输入：source /etc/profile 更新环境变量。

为了验证环境变量是否配置好，可以输入$JAVA_HOME 查看，如果显示出一行目录，则正常。

再验证jdk是否配置成功，输入：java -version 如果输入一下类似信息，则成功。

```
java version "1.8.0_171"
Java(TM) SE Runtime Environment (build 1.8.0_171-b11)
Java HotSpot(TM) 64-Bit Server VM (build 25.171-b11, mixed mode)
```

## **四、安装tomcat**

        tomcat要8.0以上版本就行，下载地址：[https://tomcat.apache.org/download-80.cgi]()

[

![](https://oscimg.oschina.net/oscnet/1de059250e189ad2d00ae7a8583faf65d18.jpg)

]()

一样的方式，将tomcat传入了Linux，解压，命名为tomcat。编辑环境变量

```
export CATALINA_HOME=/home/yue/tomcat
export CATALINA_BASE= /home/yue/tomcat        

```

最后的/etc/profile文件配置的所有环境变量如下：

[

![](https://oscimg.oschina.net/oscnet/712355973e69f46ae4977dee59e06abb300.jpg)

]()

执行 source /etc/profile 使环境变量生效

进入tomcat  的bin目录

输入./shtartup.sh

如果输出类似tomcat started的启动信息 ，则没问题。但是我们必须保证并且内网能够用http://ip:8080的方式访问tomcat，如果不行，看看是不是防火墙或者ip限制的问题，具体设置可以查看iptables的资料 http://man.linuxde.net/iptables。如果不在乎安全问题，可以直接关闭防火墙。

```
iptables -A INPUT -s 127.0.0.1 -d 127.0.0.1 -j ACCEPT               #允许本地回环接口(即运行本机访问本机)
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT    #允许已建立的或相关连的通行
iptables -A OUTPUT -j ACCEPT         #允许所有本机向外的访问
iptables -A INPUT -p tcp --dport 22 -j ACCEPT    #允许访问22端口
iptables -A INPUT -p tcp --dport 80 -j ACCEPT    #允许访问80端口
iptables -A INPUT -p tcp --dport 21 -j ACCEPT    #允许[ftp]()服务的21端口
iptables -A INPUT -p tcp --dport 20 -j ACCEPT    #允许FTP服务的20端口
iptables -A INPUT -j [reject]()       #禁止其他未允许的规则访问
iptables -A FORWARD -j REJECT     #禁止其他未允许的规则访问
```

我这边是已经配置成功了：

[

![](https://oscimg.oschina.net/oscnet/56d9a506282c755f6b1928374c8495a1a5a.jpg)

]()

## **五、安装必须的依赖库**

前面提到，Guacamole分为两部分：提供guacd代理和相关库的 guacamole-server，以及为servlet容器（通常为[Tomcat）]()提供客户端的guacamole-client。现在就先构建server。

guacamole-server 包含了guacamole连接到远程桌面的必要组件，这些组件需要依赖一些库。

guacd是guacamole-server的守护进程，接收来自web应用的隧道连接，然后代表guacamole连接到远程桌面。

安装必须的库，来自官方的整理，以下这些库都是必须安装的。

[

![](https://oscimg.oschina.net/oscnet/9d6548ec4c47a69aba2571e908aa1e577f9.jpg)

]()

输入不同命令安装：

```
sudo yum install cairo-devel

sudo yum install libjpeg-turbo-devel  这个如果安装不了就使用 sudo yum install libjpeg-devel

sudo yum install libpng-devel

sudo yum install uuid-devel

另外还有两个必须安装的

sudo yum install ffmpeg-devel

sudo yum install libvncserver-devel
```

## **六、安装server**

下一步，http://guacamole.apache.org/releases/0.9.14/ 这里下载guacamole-client和server的tar包，通过secureCRT传到Linux，在Linux解压，tar -zxvf 文件名。

[

![](https://oscimg.oschina.net/oscnet/a2528e981b5cc95ef9a6fa471fd57e1f965.jpg)

]()

在Linux上home/yue目录下新建guacamole文件夹，将解压后的server和client包移动进去。

进入解压后的server包，guacamole-server-0.9.14目录下，执行以下命令：

```
sudo .configure --with-init-dir=/etc/init.d

sudo make

sudo make install

ldconfig  （更新系统已安装库的缓存）
```

执行：  guacd 

弹出消息 guacd[23084]: INFO:     Guacamole proxy daemon (guacd) version 0.9.14 started  证明server安装成功了。

## **七、安装client**

安装guacamole-client(即web服务器)

进入guacamole-client-0.9.14 执行:

mvn package

```
$ mvn package
[INFO] Scanning for projects...
[INFO] ------------------------------------------------------------------------
[INFO] Reactor Build Order:
[INFO] 
[INFO] guacamole-common
[INFO] guacamole-ext
[INFO] guacamole-common-js
[INFO] guacamole
[INFO] guacamole-auth-jdbc
[INFO] guacamole-auth-jdbc-base
[INFO] guacamole-auth-jdbc-mysql
[INFO] guacamole-auth-jdbc-postgresql
[INFO] guacamole-auth-ldap
[INFO] guacamole-auth-noauth
[INFO] guacamole-client
...
[INFO] ------------------------------------------------------------------------
[INFO] Reactor Summary:
[INFO] 
[INFO] guacamole-common ................................... SUCCESS [  7.566 s]
[INFO] guacamole-ext ...................................... SUCCESS [  5.594 s]
[INFO] guacamole-common-js ................................ SUCCESS [  1.249 s]
[INFO] guacamole .......................................... SUCCESS [  8.474 s]
[INFO] guacamole-auth-jdbc ................................ SUCCESS [  0.592 s]
[INFO] guacamole-auth-jdbc-base ........................... SUCCESS [  2.548 s]
[INFO] guacamole-auth-jdbc-mysql .......................... SUCCESS [  2.557 s]
[INFO] guacamole-auth-jdbc-postgresql ..................... SUCCESS [  1.990 s]
[INFO] guacamole-auth-ldap ................................ SUCCESS [  1.314 s]
[INFO] guacamole-auth-noauth .............................. SUCCESS [  0.961 s]
[INFO] guacamole-client ................................... SUCCESS [  1.721 s]
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time: 34.701 s
[INFO] Finished at: 2015-06-08T17:03:15-07:00
[INFO] Final Memory: 34M/340M
[INFO] ------------------------------------------------------------------------
$
```

如果，你没有mvn包，那么请先yum install maven

这个时候在当前目录的guacamole/target目录下，会有个guacamole-0.9.14.war包。将这个包复制到tomcat的webapps目录下。这个tomcat就用我们上面配置好的。

sudo cp guacamole-0.9.14  tomcat的webapps目录/guacamole.war

好了，启动tomcat，局域网内访问服务器的8080端口, http://ip:8080/guacamole，你会看到这样的画面

[

![](https://oscimg.oschina.net/oscnet/ce54286748608b61ad01d5695bfd6845283.jpg)

]()

但是此时，你点击登录是没有任何作用的，因为还要配置一些东西。

## **八、配置guacamole的环境：**

## **`1、GUACAMOLE_HOME`**

`GUACAMOLE_HOME`是Guacamole的默认配置目录，可在/etc/profile中指定此目录：

末尾加入  export GUACAMOLE_HOME=/home/yue/guacamole

当然如果不做配置，guacamole也会默认将/etc/guacamole作为`GUACAMOLE_HOME，但是你需要自己去新建这个目录。为了方便，我将它配置成了和server包，client包同一目录。即`/home/yue/guacamole

在该目录下新建

`**guacamole.properties**`

这是主要的Guacamole配置文件。该文件中的属性规定了Guacamole将如何连接到guacd。在文件中写入：

guacd-hostname:localhost
guacd-port:4822

2、新建`**logback.xml**`

Guacamole使用称为Logback的日志系统来处理所有消息。默认情况下，Guacamole只会登录到控制台，但可以通过提供你自己的Logback配置文件来改变它。我们写成这样就好：guacamole运行时，会生成guacamole.log在当前目录，记录所有debug级别的日志。

```
<configuration>
 <appender name="FILE" class="ch.qos.logback.core.FileAppender">
  <file>/home/yue/guacamole/guacamole.log</file>
   <encoder>
     <pattern>%msg%n</pattern>
   </encoder>
 </appender>
 <root level="debug">
   <appender-ref ref="FILE" />
 </root>
</configuration>
```

3.新建user-mapping.xml  写入

```
<user-mapping>
    <authorize username="test" password="test">
        <protocol>vnc</protocol>
        <param name="hostname">192.168.162.15</param>
        <param name="port">5900</param>
    </authorize>
</user-mapping>
```

[

![](https://oscimg.oschina.net/oscnet/a28b90b2174becdaba5aaaeb9e1269ebf55.jpg)

]()

这里是说，新增一个vnc服务器，服务器地址为192.168.162.15，vnc所有端口为5900，guacamole连接这个vnc服务器的用户名和密码为test，test。接下来的操作，不用我说也知道，

如果想配置多个连接，就写多个authorize节点。

到此为止，GUACAMOLE_HOME的目录下现在一共有一下几个文件，

```
guacamole-client-0.9.14   
guacamole-server-0.9.14 
guacamole.properties    
logback.xml  
user-mapping.xml
```

user-mapping.xml文件写入后，guacamole会自动去读取，等一会儿后，就能生效，不需要重启guacd或者tomcat。

不过，如果你以为这样就能完事的话，那就错了 ，因为还差最后一步，远程主机vnc服务器的搭建！

## **九、vnc服务器搭建**

vnc-server下载地址 [https://www.realvnc.com/en/connect/download/vnc/]()

在远程主机安装vnc-server，我这里的远程主机是window系统，ip地址为192.168.162.15，所以直接安装exe就好。为了测试容易，把防火墙也关了吧，免得存在访问限制问题。vnc服务器需要关闭密码保护, 不然guacamole不能连接成功，端口也设置成5900。大概设置如下

[

![](https://oscimg.oschina.net/oscnet/e3c220a3350300fec03bc5485fe0a1b4265.jpg)

]()

[

![](https://oscimg.oschina.net/oscnet/e4ea37c6084174410cc1f06e5c659cd6bca.jpg)

]()

好了，这个时候在guacamole登录页面上输入test，test登录，就能看到远程主机的实时画面了。

**下一篇博客，我将会写如果自己构建web程序，代替guacamole-client，并嵌入到java程序中，实现[web系统集成guacamole]()。**