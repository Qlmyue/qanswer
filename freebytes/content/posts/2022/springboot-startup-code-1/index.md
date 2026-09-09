---
title: "SpringBoot启动源码分析"
slug: springboot-startup-code-1
date: 2022-03-07 07:16:38
category: java
tags: [java, java, springboot, 精品]
status: published
views: 1426
---

我将springboot源码从官网上clone下来，并在此源码上研究、写注释、写文档，由此梳理出了一些知识点，暂且将一些成果（启动源码）分享出来。

官方源码地址：https://github.com/spring-projects/spring-boot/tree/v1.0.0.RELEASE

> 

注意，文中springboot的源码基于版本1.0.0.RELEASE, 现在已经出到2.x版本了，但是不同版本的启动流程代码大致上相同，对研究启动流程来说没有什么影响，反而更加方便研究。

### 一、主入口代码如下

```
@EnableAutoConfiguration
@ComponentScan({"org.springframework", "test"})
public class Application {   
    public static void main(String[] args) {        
      SpringApplication springApplication = new SpringApplication(Application.class);        
      springApplication.run(args);   
      }
 }
```

1. SpringApplication是程序启动的类，包括了很多初始化的代码。
2. new一个SpringApplication对象的时候，会执行如下的初始化操作：

```
private void initialize(Object[] sources) {    
       if (sources != null && sources.length > 0) {        
          this.sources.addAll(Arrays.asList(sources));    
          }   
      //确定是否web环境    
      this.webEnvironment = deduceWebEnvironment();    
      //设置初始化器（从spring.factories文件中去找接口为ApplicationContextInitializer的实现类）    
     setInitializers((Collection) 
     getSpringFactoriesInstances(ApplicationContextInitializer.class));    
     //设置监听器（从spring.factories文件中去找接口为ApplicationListener的实现类）    
     setListeners((Collection) 
     getSpringFactoriesInstances(ApplicationListener.class));    
     //设置主方法类    
     this.mainApplicationClass = deduceMainApplicationClass();
}
```

    3. 执行springApplication.run(args)代码，启动springboot：

```
public ConfigurableApplicationContext run(String... args) {    
      StopWatch stopWatch = new StopWatch();    
      //开启计时器    
      stopWatch.start();    
      ConfigurableApplicationContext context = null;    
      System.setProperty("java.awt.headless", Boolean.toString(this.headless));    
      //获取监听器的触发器    
      Collection<SpringApplicationRunListener> runListeners = getRunListeners(args);    
      //遍历启动触发器, 其实只有一个触发器    
      for (SpringApplicationRunListener runListener : runListeners) {        
           runListener.started();    
      }    
      try {        
      //创建web环境        
      ConfigurableEnvironment environment = getOrCreateEnvironment();        
      //配置web环境        
      configureEnvironment(environment, args);        
      for (SpringApplicationRunListener runListener : runListeners) {            
          //准备读取环境变量            
          runListener.environmentPrepared(environment);        
      }        
      //打印banner图
      if (this.showBanner) {            
        printBanner();       
      }        
      //创建一个AnnotationConfigEmbeddedWebApplicationContext实例,        
      context = createApplicationContext();        
      if (this.registerShutdownHook) {            
        try {                
        //注册关闭钩子,用于安全关闭context                
        context.registerShutdownHook();            
        } catch (AccessControlException ex) {                
            // Not allowed in some environments.            
        }        
      }       
       //给ApplicationSpringContext设置环境        
       context.setEnvironment(environment);        
       //调用初始化器 ，初始化context
       applyInitializers(context);        
       for (SpringApplicationRunListener runListener : runListeners) {            
           //发布context准备事件            
           runListener.contextPrepared(context);        
       }        
       if (this.logStartupInfo) {            
            logStartupInfo(context.getParent() == null);       
       }        
       // Load the sources       
       Set<Object> sources = getSources();       
       Assert.notEmpty(sources, "Sources must not be empty");        
       //把bean加载到context中        
       load(context, sources.toArray(new Object[sources.size()]));       
       for (SpringApplicationRunListener runListener : runListeners) {            
            runListener.contextLoaded(context);       
       }        
      // Refresh the context        
      refresh(context);        
      afterRefresh(context, args);        
      for (SpringApplicationRunListener runListener : runListeners) {            
          //发布结束事件            
          runListener.finished(context, null);        
      }        
      //结束计时        
      stopWatch.stop();        
      .......

```

   4. refresh(context);   该方法需要重点关注，因为tomcat是在这里面创建的。

```
@Override
public void refresh() throws BeansException, IllegalStateException {
	synchronized (this.startupShutdownMonitor) {
        // Prepare this context for refreshing.
        prepareRefresh();

        // Tell the subclass to refresh the internal bean factory.
        ConfigurableListableBeanFactory beanFactory = obtainFreshBeanFactory();

        // Prepare the bean factory for use in this context.
        prepareBeanFactory(beanFactory);

        try {
            // Allows post-processing of the bean factory in context subclasses.
            postProcessBeanFactory(beanFactory);

            // Invoke factory processors registered as beans in the context.
            invokeBeanFactoryPostProcessors(beanFactory);

            // Register bean processors that intercept bean creation.
            registerBeanPostProcessors(beanFactory);

            // Initialize message source for this context.
            initMessageSource();

            // Initialize event multicaster for this context.
            initApplicationEventMulticaster();

            // Initialize other special beans in specific context subclasses.
            //创建tomcat容器
            onRefresh();

            // Check for listener beans and register them.
            registerListeners();

            // Instantiate all remaining (non-lazy-init) singletons.
            finishBeanFactoryInitialization(beanFactory);

            // Last step: publish corresponding event.
            //启动tomcat容器
            finishRefresh();
        }
       }
}
```

其中，onRefresh()方法的作用是，初始化其他一些特殊的bean，也就包括了tomcat容器，这个方法正是连接tomcat与spring的关键点。换句话说，其实tomcat是依赖于spring去启动的。而这个方法在AbstractApplicationContext中，是抽象方法：

```
protected void onRefresh() throws BeansException {            
    // For subclasses: do nothing by default.
}
```

需要由子类去提供实现方法，通过断点调试，可以知道它的真正子类是，EmbeddedWebApplicationContext，也就是这里调用的其实是EmbeddedWebApplicationContext.onRefresh()方法。

   5. 可深入onRefresh()查看，createEmbeddedServletContainer()就是创建内嵌的servlet容器，也就是创建内嵌tomcat的入口。

```
@Override
protected void onRefresh() {            
    super.onRefresh();            
    try {                        
        createEmbeddedServletContainer();            
        } catch (Throwable ex) {                        
            throw new ApplicationContextException("Unable to start embedded                   container",ex);           
        }
    }
```

   6. 再深入finishRefresh()方法看看，发现有启动tomcat的代码：

```
@Override
protected void finishRefresh() {
     super.finishRefresh();
     //启动tomcat
     startEmbeddedServletContainer();
       if (this.embeddedServletContainer != null) {
	publishEvent(new EmbeddedServletContainerInitializedEvent(this,
				this.embeddedServletContainer));
       }
}
```

### 二、总的来说流程如下

1. 在声明SpringApplication对象的时候，根据所有的spring.factories文件加载ApplicationContextInitializer的实现类，也就是ApplicationContext的初始化器，根据所有的spring.factories文件加载ApplicationListener的实现类，也就是监听器。
2. 在run方法执行后，首先从spring.factories文件中加载能够SpringApplicationRunListener的实现类，也就是能够触发监听器的触发器。
3. 触发器发布启动事件，监听器随之执行启动事件的对应操作。
4. 创建web环境，配置准备读取application配置文件的环境变量。
5. 创建ApplicationContext容器，并调用所有的对应初始化器
6. 把bean加载到ApplicationContext中，利用触发器发布容器加载事件。
7. 刷新ApplicationContext容器，并创建和启动tomcat容器。
8. 发布结束事件。

### 三、从生命周期方面去看springboot的启动流程

SpringApplication是负责启动springboot的主类，但他没有直接生命周期，不过他有一个触发器SpringApplicationRunListener，他每走一个步骤都会利用该触发器去发布对应的事件，而这个触发器的api如下：

```
//1、启动
void started();
//2、环境准备
void environmentPrepared(ConfigurableEnvironment environment);
//3、context准备
void contextPrepared(ConfigurableApplicationContext context);
//4、context加载
void contextLoaded(ConfigurableApplicationContext context);
//5、结束
void finished(ConfigurableApplicationContext context, Throwable exception);
```

这是不是很像生命周期，我想将它当做springboot本身的生命周期也没有问题吧。
他在第一阶段前，做好了监听器、初始化器的加载，在第2阶段前创建和配置好web环境，在第3阶段前初始化好context，在第4阶段加载bean到context，刷新容器、启动tomcat后执行第5阶段。

### 四、需要关注的重要类

##### 1.SpringFactoriesLoader

此类当中的loadFactoryNames(Class factoryClass, ClassLoader classLoader)方法，作用是在当前项目下所有的class文件中（包括jar包内的class文件）寻找到META-INF/spring.factories文件中，对应factoryClass的实现类的权限定名，以便程序用反射的方式去加载它们。如某spring.factories文件中的代码：

```
org.springframework.context.ApplicationContextInitializer=\
org.springframework.boot.autoconfigure.logging.AutoConfigurationReportLoggingInitializer
```

这个AutoConfigurationReportLoggingInitializer会被找出来。

##### 2. EnableAutoConfigurationImportSelector

这个类是注解@EnableAutoConfiguration中@Import进来的类，如下：

```
@Import({EnableAutoConfigurationImportSelector.class,
AutoConfigurationPackages.Registrar.class })
public @interface EnableAutoConfiguration {            
       Class<?>[] exclude() default {};
 }
```

被@Import引入的类，也应是个配置类。

此类的selectImports(AnnotationMetadata metadata)方法，作用是利用SpringFactoriesLoader.loadFactoryNames()找出写在spring.factories的EnableAutoConfiguration的所有实现类。

如：

```
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
org.springframework.boot.autoconfigure.aop.AopAutoConfiguration,\
org.springframework.boot.autoconfigure.amqp.RabbitAutoConfiguration,\
org.springframework.boot.autoconfigure.data.JpaRepositoriesAutoConfiguration,\
org.springframework.boot.autoconfigure.redis.RedisAutoConfiguration
```

aop、rabbit、jpa、redis这些组件的配置类AopAutoConfiguration、RabbitAutoConfiguration、JpaRepositoriesAutoConfiguration、RedisAutoConfiguration，都会被找出来，作进一步的处理。

而它们恰恰是这些外部组件（spring-redis、spring-rabbit等组件）的关键配置类，springboot处理它们，它们去处理自己的组件，这样一来，整个依托于springboot框架的软件系统就被带动起来。

> 

另，如果有需要我写的注释和文档的代码，欢迎联系，一起学习。