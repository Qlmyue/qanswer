---
title: "SpringBoot集成JPA"
slug: springboot-jpa
date: 2019-09-02 06:00:25
category: java
tags: [java, java, jpa, springboot]
summary: "SpringBoot2集成JPA"
status: published
views: 2205
---

### 1.创建新的maven项目

![](https://static.oschina.net/uploads/space/2018/0120/192629_j5qU_3490860.png)

### 2. 添加必须的依赖

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
        <!--mysql驱动-->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
        </dependency>
    </dependencies>

```

### 3. 新建springboot启动类

```
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class,args);
    }
}
```

### 4. 在resources跟目录下新建application.properties

```
#建立/更新数据表的配置
spring.jpa.hibernate.ddl-auto=update
#数据库地址
spring.datasource.url=jdbc:mysql://localhost:3306/qian?useUnicode=true&characterEncoding=utf-8&serverTimezone=GMT%2B8
#数据库用户名
spring.datasource.username=root
#数据库密码
spring.datasource.password=123
#驼峰命名自动转下划线
spring.jpa.hibernate.naming.physical-strategy=org.springframework.boot.orm.jpa.hibernate.SpringPhysicalNamingStrategy
#使用mysql数据库
spring.jpa.database=*mysql
*# 显示后台处理的SQL语句
spring.jpa.show-sql=true
```

- update:Hibernate根据给定的Entity结构改变数据库。
- create: 每次都会创建数据库,关闭时不会删除
- none: mysql的默认设置 , 不改变数据结构
- create-drop: 创建数据库,但是每次sessionFactory关闭后都会删除

### 5. 新建实体类User

这个时候其实已经可以启动springboot, 但是不会生成数据表,因为还没有配置实体类的jpa

![](https://static.oschina.net/uploads/space/2018/0120/202424_JnuG_3490860.png)

先新建user.java

```

import org.hibernate.annotations.GenericGenerator;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

/**
 * Created by Andy on 2018/1/20.
 */
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
    private Integer age;
    private Boolean sex;

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

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public Boolean getSex() {
        return sex;
    }

    public void setSex(Boolean sex) {
        this.sex = sex;
    }
}
```

这时候启动项目,就会在指定位置下生成一个user数据表

![](https://static.oschina.net/uploads/space/2018/0120/202820_o8GC_3490860.png)

### 6. 实现CRUD

CrudRepository是一个提供了普通增删改查方法的接口，由spring内部提供，其源码如下：

```
@NoRepositoryBean
public interface CrudRepository<T, ID extends Serializable> extends Repository<T, ID> {
    <S extends T> S save(S var1);

    <S extends T> Iterable<S> save(Iterable<S> var1);

    T findOne(ID var1);

    boolean exists(ID var1);

    Iterable<T> findAll();

    Iterable<T> findAll(Iterable<ID> var1);

    long count();

    void delete(ID var1);

    void delete(T var1);

    void delete(Iterable<? extends T> var1);

    void deleteAll();
}

```

我们只需要新建UserRepository.java继承CrudRepository即可：

```
public  interface UserRepository extends CrudRepository<User, String> {

}
```

### 7. 实现controller控制

新建UserController.java

```
@RestController
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @RequestMapping("/add")
    public User add(String name){
        User user = new User();
        user.setName(name);
        return userRepository.save(user);
    }

    @RequestMapping("/list")
    public Iterable<User> list(){
        Iterable<User> all = userRepository.findAll();
        return all;
    }
}
```