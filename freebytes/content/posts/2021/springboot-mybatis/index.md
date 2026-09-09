---
title: "Springboot整合mybatis"
slug: springboot-mybatis
date: 2021-04-01 08:17:26
category: java
tags: [java, java, springboot]
status: published
views: 1836
---

![](https://www.freebytes.net/wp-content/uploads/2021/04/微信截图_20210401142756.png)

项目结构

**Dao层UserMapper **

```
//@Repository 
@Mapper
public interface UserMapper {
//    @Select("SELECT * FROM user")
    List<User> findAll();

    User getUserById(Long id);
}
```

**Service**

```
@Service("userService")
public class UserService{

    @Autowired
    private UserMapper userMapper;

    public List<User> findAll() {
        System.out.println("success");
        List<User> a =  userMapper.findAll();
        System.out.println(a.size());
        return a;
    }

    public User getUserById(Long id) {
        User user = userMapper.getUserById(id);
        System.out.println("id=" + id + " " +user);
        return user;
    }
}
```

**Controller**

```
@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    UserService userService;

    @RequestMapping("/findAll")
    public List<User> findAll(){
        return userService.findAll();
    }

    @RequestMapping("/getUser/{id}")
    public User getUser(@PathVariable Long id){
        return userService.getUserById(id);
    }
}
```

**Entity**

```
public class User implements Serializable {

    private Long id;//编号
    private String username;//用户名
    private String password;//密码

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
```

```
 **UserMapper.xml** 
 在SpringBoot中，参数占位符用#｛arg0｝，#｛arg1｝，#｛arg…｝ 
```

```
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd" >
<mapper namespace="com.chenwenhuan.springbootlearning.mapper.UserMapper">
    <select id="findAll" resultType="com.chenwenhuan.springbootlearning.entity.User">
        SELECT * FROM user
    </select>
    <select id="getUserById" resultType="com.chenwenhuan.springbootlearning.entity.User">
        SELECT * FROM user where id = #{id}
    </select>
</mapper>
```

**application.ym**l

> 

*type-aliases-package*如果此处配置了返回值属性包路径，mapper.xml  的resultType 只写User即可 

```
server:
  port: 8082
spring:
  *#数据库连接配置
  *datasource:
*#    name: springboot
    *driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/springboot?characterEncoding=utf-8&useSSL=false
    username: root
    password: *****

*#  mybatis的相关配置
*mybatis:
  *#mapper配置文件
  *mapper-locations: classpath:mapper/*.xml
*#  type-aliases-package: com.chenwenhuan.springbootlearning.entity
  #开启驼峰命名
  *configuration:
    map-underscore-to-camel-case: true
```

**启动类**

如果多个mapper包，可以使用字符串数组形式

> 

 @MapperScan(basePackages = {"mapper接口所在包"}) 

```
@SpringBootApplication
@MapperScan("com.chenwenhuan.springbootlearning.mapper")
public class SpringbootlearningApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringbootlearningApplication.class, args);
    }

}
```

测试结果

![](https://www.freebytes.net/wp-content/uploads/2021/04/image.png)

补充说明

 1、@MapperScan 注解加了之后，其实Dao 类的@Mapper可以不用再加。 SpringBoot会扫描 @MapperScan  对应的包，把其中的类加入到Spring容器里面，实现Autowired 注入

2、@Mapper 和 @Repository 都是作用于Dao 层，对于容器来说都是bean，但是Repository不可以单独使用，否则报错，需要@componentScan 扫描包

3、Repository 可以消除业务层中注入mapper对象的编译错误

![](https://www.freebytes.net/wp-content/uploads/2021/04/image-1.png)