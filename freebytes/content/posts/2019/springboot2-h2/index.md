---
title: "springboot2.x集成H2数据库"
slug: springboot2-h2
date: 2019-12-16 10:02:03
category: java
tags: [h2, java, springboot]
summary: "本文讲解springboot2.x集成H2数据库的知识，实现基本的增删改查和h2在线控制台的访问功能。"
status: published
views: 2713
---

### 添加依赖

```
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.1.8.RELEASE</version>
        <relativePath />
    </parent>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <version>1.4.199</version>
        </dependency>
    </dependencies>
```

这里使用了jpa、h2、springboot三个组件。

### 修改配置文件application.properties

```
server.port=8080

# h2数据库
spring.datasource.url=jdbc:h2:./database/freebytes
spring.datasource.username=test
spring.datasource.password=test
spring.jpa.show-sql=true
spring.datasource.driverClassName=org.h2.Driver
spring.jpa.generate-ddl=true
#spring.jpa.hibernate.ddl-auto=update

##h2 web console设置
spring.datasource.platform=h2
#进行该配置后，h2 web consloe就可以在远程访问了。否则只能在本机访问。
spring.h2.console.settings.web-allow-others=true
#进行该配置，你就可以通过YOUR_URL/h2访问h2 web consloe
spring.h2.console.path=/h2
#进行该配置，程序开启时就会启动h2 web consloe
spring.h2.console.enabled=true
```

这里配置了本地数据库文件，并设置了用户名和密码，开启了h2的在线控制台访问功能。

### 数据库实体类

```
@Entity
@Table(name = "test")
public class TestEntity {
    @Id
    private Integer id;
    @Column
    private String name;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
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

### 数据库操作类

```
//负责对TestEntity的增删改查
public interface TestRepository extends CrudRepository<TestEntity,Integer> {
}
```

### 测试类

```
@RestController
public class TestController {
    @Autowired
    private TestRepository testRepository;

    @GetMapping("/save")
    public TestEntity save(Integer id ,String name){
        TestEntity testEntity = new TestEntity();
        testEntity.setId(id);
        testEntity.setName(name);
        return testRepository.save(testEntity);
    }

    @GetMapping("/update")
    public TestEntity update(Integer id ,String name){
        Optional<TestEntity> entity = testRepository.findById(id);
        TestEntity testEntity = entity.get();
        testEntity.setName(name);
        return testRepository.save(testEntity);
    }

    @GetMapping("/list")
    public Iterable list(){
        return testRepository.findAll();
    }

    @GetMapping("/get")
    public TestEntity get(Integer id ){
        return testRepository.findById(id).get();
    }
}
```

### springboot启动类

```
@EnableAutoConfiguration
@ComponentScan
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class);
    }
}

```

启动后，可输入以下url测试接口 
http://localhost:8080/save?id=11&name=xxx
http://localhost:8080/update?id=11&name=xxx 
http://localhost:8080/get?id=11
http://localhost:8080/list

### 访问控制台

在浏览器访问 http://localhost:8080/h2，则出现h2的在线控制台——

[

![](https://www.freebytes.net/wp-content/uploads/2019/12/image-17.png)

]()