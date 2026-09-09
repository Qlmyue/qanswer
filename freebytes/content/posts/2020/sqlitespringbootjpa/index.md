---
title: "整合SQLite+SpringBoot+JPA"
slug: sqlitespringbootjpa
date: 2020-02-28 09:01:30
category: java
summary: "我发现网上对于整合SQLite+SpringBoot+JPA的文章挺少的，有些写的也比较复杂，于是稍微研究了一下，整理了比较简单的整合版。"
status: published
views: 4173
---

## 简介

今天在对一个系统设计进行技术选型的时候，纠结于是否继续使用H2轻量级数据库。H2虽然是java编写的，也很适用于java编程的数据库，但是之前在使用时还是发现了一些坑，而且用的人并不算多。于是考虑到了另一个数据库——SQLite。

我想试着把springboot项目跟SQLite结合使用，最好是还能结合JPA，但是我发现网上对于整合SQLite+SpringBoot+JPA的文章挺少的，有些写的也比较复杂，于是稍微研究了一下，整理了比较简单的整合版。

## SQLite介绍

SQLite是一个C语言编写的轻量级数据库，是一个实现了自给自足的、无服务器的、零配置的、事务性的 SQL 数据库引擎 ，被广泛应用于安卓端、PC端。 

## 整合步骤

第一，新建maven项目，添加必要的依赖，只需要springboot的、jpa的和sqlite的。

```
    <!--springboot的必须依赖-->
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.1.3.RELEASE</version>
    </parent>
    <dependencies>
        <!--启动springmvc的相关配置,springboot的自动配置-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <!--jpa-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
    <!--sqlite的必须依赖-->
        <dependency>
            <groupId>org.xerial</groupId>
            <artifactId>sqlite-jdbc</artifactId>
            <version>3.30.1</version>
        </dependency>
        <dependency>
            <groupId>com.github.gwenn</groupId>
            <artifactId>sqlite-dialect</artifactId>
            <version>0.1.0</version>
        </dependency>
    </dependencies>

```

第二步，新建application.properties文件——

```
spring.datasource.driver-class-name=org.sqlite.JDBC
#数据库地址
spring.datasource.url=jdbc:sqlite:test.db
#每次启动更改数据表结构
spring.jpa.hibernate.ddl-auto=update
#显示数据库操作记录
spring.jpa.show-sql=true

#数据库用户名和密码，由于sqltie3的开源版并没有数据库加密功能，所以这两个配置其实无效
#spring.datasource.username=test
#spring.datasource.password=test
```

第三步，编写springboot启动类——

```
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class,args);
    }
}
```

第四步，编写数据表对应的实体类User.java——

```
import org.hibernate.annotations.GenericGenerator;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

//表明这是个需要生成数据表的类
@Entity
public class User {
//    定义主键id
    @Id
//    声明一个策略通用生成器，name为”system-uuid”,策略strategy为”uuid”。
    @GenericGenerator(name = "system-uuid", strategy ="uuid")
//    用generator属性指定要使用的策略生成器。
    @GeneratedValue(generator = "system-uuid")
    private String id;
    private String name;
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
}
```

第五步，编写实现User实体增删改查的接口类——

```
public  interface UserRepository extends CrudRepository<User, String> {

}
```

第五步，编写web测试类——

```
@RestController
public class UserController {
    @Autowired
    private UserRepository userRepository;
    /**
     * 新增一条数据
     * @param name
     * @return
     */
    @RequestMapping("/add")
    public User add(String name){
        User user = new User();
        user.setName(name);
        return userRepository.save(user);
    }
    /**
     * 查询所有数据
     * @return
     */
    @RequestMapping("/list")
    public Iterable<User> list(){
        Iterable<User> all = userRepository.findAll();
        return all;
    }
}
```

最后，启动springboot项目，发现项目目录下多了一个test.db文件，也就是sqlite数据库文件，项目整体结构如下：

[

![](https://www.freebytes.net/wp-content/uploads/2020/02/image.png)

]()

## 测试使用

打开浏览器，分别输入  [http://localhost:8080/add?name=test]() ， [http://localhost:8080/list]() 进行测试。 

## 使用可视化工具操作SQLite

既然test.db文件就是生成的数据库文件，那么有没有什么办法能直接打开这个文件进行可视化操作数据呢？官方提供了一个工具—— [DB Browser for SQLite]() 。

可在 [https://sqlitebrowser.org/dl/]() 下载合适的版本，下载后，打开程序界面，点击打开数据库，选择test.db文件即可。

[

![](https://www.freebytes.net/wp-content/uploads/2020/02/image-1.png)

]()