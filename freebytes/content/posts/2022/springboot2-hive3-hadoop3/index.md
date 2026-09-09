---
title: "SpringBoot2.x集成Hive3.x和Hadoop3.x"
slug: springboot2-hive3-hadoop3
date: 2022-12-13 02:30:08
category: java
status: published
views: 3736
---

大数据业务，难免会有使用程序远程操作hive或者hadoop的场景。

Springboot集成hive和hadoop的版本选择：

Springboot：2.1.4
hive：3.1.3
hadoop：3.3.4

### maven配置

由于我仅需要操作hive的jdbc命令和hadoop的常用命令，因此只需要引入hive-jdbc包和hadoop-client包：

```
        <dependency>
            <groupId>org.apache.hive</groupId>
            <artifactId>hive-jdbc</artifactId>
            <version>3.1.3</version>
            <exclusions>
                <exclusion>
                    <groupId>org.eclipse.jetty</groupId>
                    <artifactId>jetty-runner</artifactId>
                </exclusion>
                <exclusion>
                    <groupId>org.apache.hadoop</groupId>
                    <artifactId>*</artifactId>
                </exclusion>
            </exclusions>
        </dependency>

        <dependency>
            <groupId>org.apache.hadoop</groupId>
            <artifactId>hadoop-client</artifactId>
            <version>3.3.4</version>
            <scope>provided</scope>
        </dependency>

```

### 集成hive-jdbc：

在application.properties文件中配置：

```
hive.jdbc.driverName=org.apache.hive.jdbc.HiveDriver
hive.jdbc.database=test
hive.jdbc.url=jdbc:hive2://hadoop-master:10000/${hive.jdbc.database}
hive.jdbc.user=test
hive.jdbc.password=
```

新增配置类：

```
@Data
@ConfigurationProperties(prefix = "hive.jdbc")
@Configuration
public class HiveConfig implements ApplicationRunner {
    private String driverName;
    private String url;
    private String user;
    private String password;
    private String database;

    private static final Logger *logger *= LoggerFactory.*getLogger*(HiveConfig.class);

    @Override
    public void run(ApplicationArguments args) throws Exception {
        *logger*.info("hive数据库链接地址======" + this.url);
    }
}
```

hive-jdbc操作代码：

```
//jdbc加载
Class.forName(hiveConfig.getDriverName());
Connection con = DriverManager.getConnection(hiveConfig.getUrl(), hiveConfig.getUser(), hiveConfig.getPassword());
private final Statement stmt  = con.createStatement();

//jdbc执行更新操作
String sql="drop table test";
stmt.executeUpdate(sql);

//jdbc执行查询操作：
String sql="show tables";
ResultSet resultSet = stmt.executeQuery(sql);
while (resultSet.next()) {
      String tableName = resultSet.getString(1);
      log.info("tableName");
}
```

### 配置hadoop-client

application.properties配置：

```
hadoop.dfs.url=hdfs://172.16.106.133:9000
hadoop.dfs.replication=3
hadoop.dfs.blockSize=2097152
hadoop.dfs.user=root
hadoop.dfs.tmpPath=/test/input/tmp/
```

新增hadoop配置类：

```
@Data
@ConfigurationProperties(prefix = "hadoop.dfs")
@Configuration
public class HadoopConfig {
    private String url;
    private String replication;
    private String blockSize;
    private String user;
    private String tmpPath;
}

```

hadoop操作类：

```
@Component
public class HadoopHelper {
    private static HadoopConfig *hadoopConfig*;
    private FileSystem fs;

    public HadoopHelper(HadoopConfig hadoopConfig) {
        this.*hadoopConfig *= hadoopConfig;
    }

    @PostConstruct
    public void init() {
        try {
            // 获取连接集群的地址
            URI uri = new URI(*hadoopConfig*.getUrl());
            // 创建一个配置文件
            Configuration configuration = new Configuration();
            //设置配置文件中副本的数量
            configuration.set("dfs.replication", *hadoopConfig*.getReplication());
            //设置配置文件块大小
            configuration.set("dfs.blocksize", *hadoopConfig*.getBlockSize());
            //获取到了客户端对象
            this.fs = FileSystem.*get*(uri, configuration, *hadoopConfig*.getUser());
            fs.mkdirs(new Path(*hadoopConfig*.getTmpPath()));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

@PreDestroy
public void close() {
    // 关闭资源
    try {
        fs.close();
    } catch (IOException e) {
        throw new RuntimeException(e);
    }
}

*/**
 * 将文件上传到hadoop目录
 **/
*public void upToTmp(String file) {
    try {
        // 参数解读：参数一：表示删除原数据  参数二：是否允许覆盖  参数三：元数据路径  参数四：目的地路径
        fs.copyFromLocalFile(false, true, "d:/test/xx.db","/temp/");
    } catch (IOException e) {
        throw new RuntimeException(e);
    }
}
```

FileSystem中有很多hadoop的api，使用方式都是一样的，可以慢慢研究。

### windows上运行需注意

如果是该springboot程序运行在windows上，是需要下载winutils工具的，而且本地需要安装一个hadoop且配置好环境变量（尽管你需要控制的是远程的hadoop而不是本地hadoop）。否则就会报这个错：

java.io.FileNotFoundException: java.io.FileNotFoundException: HADOOP_HOME and hadoop.home.dir are unset. 

可以在 [https://github.com/s911415/apache-hadoop-3.1.0-winutils/tree/master/bin]() 这里下载 winutils.exe，将hadoop.dll复制到C:\Window\System32下。

然后下载一个hadoop3.3.4到本地， 然后配置环境变量**HADOOP_HOME** 指向你的hadoop目录，**PATH**添加%HADOOP_HOME%。