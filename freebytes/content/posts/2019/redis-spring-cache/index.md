---
title: "Redis和spring缓存"
slug: redis-spring-cache
date: 2019-08-19 12:26:18
category: java
tags: [java, redis, spring, springboot]
status: published
views: 1581
---

### 简介

     说到redis缓存，我想先说下spring的默认缓存。spring对缓存的支持，是有着一套接入第三方缓存的规范的。第三方的缓存，如redis、Memcached等，如果需要在spring中使用，就要实现CacheManage。  使用spring缓存，一般需要用到三个注解：@Cacheable，@CachePut，@CacheEvict。

###  spring缓存 

        @Cacheable，可用于类上或者方法上。表示方法的返回值可以被缓存。当标记在一个类上时则表示该类所有的方法都是支持缓存的。对于一个支持缓存的方法，Spring会在其被调用后将其返回值缓存起来，以保证下次利用同样的参数来执行该方法时可以直接从缓存中获取结果，而不需要再次执行该方法。spring的缓存值是以键值对形式存在的，默认使用方法参数作为key值，可以自定义key值生成策略，或自定义key值。@Cacheable可以指定两个属性，value、key。 value属性是必须指定的，其表示当前方法的返回值是会被缓存在哪个Cache上的，对应Cache的名称。 key属性是用来指定Spring缓存方法的返回结果时对应的key的。该属性支持SpringEL表达式。当我们没有指定该属性时，Spring将使用默认策略生成key。

```
   @Cacheable(value = "coms", key = "#id")
    public Component get(String id) {
        return crudService.get(id, Component.class);
    }
```

上例中，就是指定了get方法的缓存名称为coms，key值为传入的id值，缓存值为Component。

        @CachePut，可以用于类上或者方法上。表示方法的返回值可以被更新和缓存。@CachePut标注的方法在执行前不会去检查缓存中是否存在之前执行过的结果，而是每次都会执行该方法，并将执行结果以键值对的形式存入指定的缓存中。@Cacheable和@CachePut经常联合使用，但是前提是指定相同的缓存名称和缓存key值。如下：

```

    @Cacheable(value = "coms", key = "#id")
    public Component get(String id) {
        return crudService.get(id, Component.class);
    }

    @CachePut(value = "coms", key = "#id")
    public Component update(String id) {
        Component component = crudService.get(id, Component.class);
        component.setCreateTime(new Date());
        crudService.update(component);
        return component;
    }
```

调用update方法时，也会同步更新get方法对应的缓存。

      @CacheEvict，是用来标注在需要清除缓存元素的方法或类上的。当标记在一个类上时表示其中所有的方法的执行都会触发缓存的清除操作。@CacheEvict可以指定的重要属性包括allEntries，allEntries=true则表示整个缓存名所代表的的缓存都被清空。

```
    @CacheEvict(value = "coms", allEntries = true)
    public void delete(String id) {
        crudService.delete(id, Component.class);
    }
```

### SpringBoot中使用缓存：

        1. 新建springboot项目，加入maven依赖

```
        
            org.springframework.boot
            spring-boot-starter-web
            2.1.0.RELEASE
        
```

        2. 新建启动类，加入@EnableCaching

```
@SpringBootApplication
@EnableCaching
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class);
    }
}

```

        3. 至此 ，项目已经可以启动，使用默认端口8080。一个非常简单的springboot项目搭好了。接来下编写缓存测试类。由于spring-context包已经提供了默认的缓存类，所以不需要额外都缓存依赖。

```
@RequestMapping
@RestController
public class TestCacheController {
    @GetMapping("/get")
    @Cacheable(value = "user", key = "#id")
    public User get(String id) {
        System.out.println("调用方法本身--get");
        User user = new User();
        user.setId(id);
        user.setName("第一");
        return user;
    }

    @GetMapping("/update")
    @CachePut(value = "user", key = "#id")
    public User update(String id,String name) {
        System.out.println("调用方法本身--update");
        User user = new User();
        user.setId(id);
        user.setName(name);
        return user;
    }

    @GetMapping("/delete")
    @CacheEvict(value = "user", key = "#id")
    public void delete(String id) {
        System.out.println("调用方法本身--delete");
    }
}

```

```
public class User implements Serializable{
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

        4.使用浏览器，输入请求访问多次测试结果，对比控制台的输出，验证每个注解是否正常发挥作用。我这边完全已经正常了，就不贴出截图了。

### Redis

一直都觉得redis是多么高大上的东西，毕竟从来没用过。

Redis是一个高性能的key-value型数据库，同时还提供list，set，zset，hash等数据结构的存储，支持数据的持久化。Redis的所有操作都是原子性的。具体的安装、命令教程都可以从官网查看：http://www.redis.net.cn/tutorial/3501.html。

总结来说，就是一个redis分服务端和客户端两部分，服务端负责存储数据，客户端连接服务端之后，以命令的形式控制服务端。redis通常被用作系统和数据库之间的临时内存，系统从redis中获取数据比从数据库中直接获取数据会快很多。

redis集成到spring中，需要实现CacheManager。并导入相关的依赖和配置。

### SpringBoot中使用Redis

        1. 使用上文搭建好的springboot作为基础，集成redis。

        2.加入依赖

```
        
            org.springframework.boot
            spring-boot-starter-data-redis
            2.1.0.RELEASE
        
```

        3. 加入application.properties的相关配置

```
# Redis数据库索引（默认为0）
spring.redis.database=0
# Redis服务器地址
spring.redis.host=192.168.65.45
# Redis服务器连接端口
spring.redis.port=6379
# Redis服务器连接密码（默认为空）
spring.redis.password=test
# 连接池最大连接数（使用负值表示没有限制）
spring.redis.jedis.pool.max-active=8
# 连接池最大阻塞等待时间（使用负值表示没有限制）
spring.redis.jedis.pool.max-wait=-1
# 连接池中的最大空闲连接
spring.redis.jedis.pool.max-idle=8
# 连接池中的最小空闲连接
spring.redis.jedis.pool.min-idle=2
# 连接超时时间（毫秒）
spring.redis.timeout=3000
```

        4. 加入配置类

```
@Configuration
public class RedisConfig extends CachingConfigurerSupport {
    @Bean("userTemplate")
    public RedisTemplate redisTemplate(RedisConnectionFactory redisConnectionFactory) {
        RedisTemplate userRedisTemplate = new RedisTemplate();
        Jackson2JsonRedisSerializer userJackson2JsonRedisSerializer = new Jackson2JsonRedisSerializer(User.class);
        userRedisTemplate.setValueSerializer(userJackson2JsonRedisSerializer);
        userRedisTemplate.setHashValueSerializer(userJackson2JsonRedisSerializer);
        userRedisTemplate.setKeySerializer(new StringRedisSerializer());
        userRedisTemplate.setHashKeySerializer(new StringRedisSerializer());
        userRedisTemplate.setConnectionFactory(redisConnectionFactory);
        return userRedisTemplate;
    }
}

```

        5.编写测试类

```
@RequestMapping("/redis")
@RestController
public class TestRedisController {
    @Autowired
    @Qualifier("userTemplate")
    private RedisTemplate redisTemplate;
    
    @GetMapping("/get")
    public User get(String id) {
        if (redisTemplate.opsForValue().get("user")!=null){
            return redisTemplate.opsForValue().get("user");
        }
        System.out.println("调用方法本身--get");
        User user = new User();
        user.setId(id);
        user.setName("第一");
        redisTemplate.opsForValue().set("user",user);
        return user;
    }
    
}
```

浏览器访问，第一次输出“调用方法本身--get”，但是第二次没有输出在，证明缓存可用。并且，通过redis-cli连接到redis服务器，输入“get user” ，就会发现确实存在着这么一个缓存：

![](https://oscimg.oschina.net/oscnet/ac658ab860c48ae7149268e1c1e7d3b9d48.jpg)