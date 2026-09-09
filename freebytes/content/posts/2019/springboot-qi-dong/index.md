---
title: "SpringBoot启动类注解全析"
slug: springboot-qi-dong
date: 2019-09-26 02:25:06
category: java
tags: [java, java, springboot, 精品]
summary: "简单来说，springboot的启动之前会对spring环境进行初始化操作，这个操作包括，先把根据注解@EnableAutoConfiguration获取所有的spring.factories文件，将内容解析成bean，并且根据@ComponentScan扫描所有的component组件加载成bea"
status: published
views: 4676
---

### 简介

本文承接上文《[史上最精简的springboot项目搭建]()》，主要讲解springboot项目启动类中的注解@SpringBootApplication。

### @SpringBootApplication注解的组成

通过查看@SpringBootApplication这个注解类的源码，我们可以看到，这个注解其实包括了三个注解——

```
@SpringBootConfiguration
@ComponentScan
@EnableAutoConfiguration
```

而其中@SpringBootConfiguration又是只有@Configuration注解而已，所以 @SpringBootApplication 其实相当于以下三个注解——

```
@Configuration
@EnableAutoConfiguration
@ComponentScan
```

springboot项目为了方便开发者使用，才使用了 SpringBootApplication注解来代替这三个注解，其实在启动类上，也可以只使用这三个注解。

### @Configuration解析

@Configuration其实是 JavaConfig配置类的一个标识， spring扫描到拥有 @Configuration注解的类时，会将它定义为配置类，从而针对它做一些初始化bean的操作等。
在以前使用spring框架的时候，我们定义bean通常是通过xml配置文件去定义的，如：

[

![](https://www.freebytes.net/wp-content/uploads/2019/09/image-10.png)

]()

而现在我们通过这样的方式——

```
@Configuration
public class BusAutoConfiguration {
   @Bean
   public BusEntity busEntity () {
      return new BusEntity();
   }
```

简单来说，@Configuration就是告诉spring这个BusAutoConfiguration 类中有bean需要被初始化。 spring会根据@Bean下的方法，进行对象的初始化操作， 任何一个标注了@Bean的方法，其返回值将作为一个bean定义注册到Spring的IoC容器，该bean定义的id默认就是方法名。被@Configuration 标注的类本身其实也会被注册到IoC容器中。  

所以说， 如果你不需要在启动类中配置spring的bean实例，那么这个注解其实可以不用写在启动类上。 启动类也不需要被注册到ioc容器。

### @ComponentScan解析

@ComponentScan的功能其实就是自动扫描并加载符合条件的组件（比如@service、@controller、@Component和@Repository、@Configuration等），最终将这些组件注入到IoC容器中。  我们可以通过basePackages等属性来细粒度的定制@ComponentScan自动扫描的范围，如果不指定，则默认Spring框架实现会从声明@ComponentScan所在类的package进行扫描。  所以SpringBoot的启动类最好是放在root package下，因为默认不指定basePackages。 

### @EnableAutoConfiguration解析

 @EnableAutoConfiguration作为一个复合Annotation,其自身定义关键信息如下：

```
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@AutoConfigurationPackage
@Import({AutoConfigurationImportSelector.class})
```

其中，最关键的要属`@Import(EnableAutoConfigurationImportSelector.class)`，借助EnableAutoConfigurationImportSelector，@EnableAutoConfiguration可以帮助SpringBoot应用将所有的spring.factories（包括jar包中的）配置文件收集，并将其中类似

```
org.springframework.boot.autoconfigure.EnableAutoConfiguration = com.zhcs.idm.middle.config.MidlleConfiguration  
```

这样的代码块进行解析，将MidleConfiguration类生成bean，置入ioc容器中。此时这个类MidleConfiguration本身不必声明@Configuration注解。

### 总结

简单来说，springboot的启动之前会对spring环境进行初始化操作，这个操作包括，先把根据注解@EnableAutoConfiguration获取所有的spring.factories文件，将内容解析成bean，并且根据@ComponentScan扫描所有的component组件加载成bean，统一注册到ioc容器中，然后如果这些bean中还有存在@Bean的方法，那这些方法所返回的类也会被注册成bean，加载到ioc中。
所以其实声明一个springboot的启动类，其实只需要@EnableAutoConfiguration 和 @ComponentScan 两个注解而已。