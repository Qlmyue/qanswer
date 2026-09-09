---
title: "@Transactional与synchronized同时使用的问题"
slug: transactional-synchronized
date: 2021-07-29 01:24:14
category: java
tags: [java, java]
status: published
views: 1863
---

在一段同步方法中同时使用@Transactional注解的时候，比如：

```
    @Transactional
    public synchronized void test() {
        System.out.println("数据库操作1");
        System.out.println("数据库操作2");
    }

    @Transactional
    public void test1() {
        synchronized (this) {
            System.out.println("数据库操作1");
            System.out.println("数据库操作2");
        }
    }
```

上面两种情况，同步锁也许都不能生效。因为针对@Transactional标注的方法，Spring在AOP中实现，它会生成一个临时类，并用一个实现了开启和关闭事务的同名方法来覆写原本这个被标注的方法。大概类似这样：

```
    public void test() {
        System.out.println("开启事务操作");
        //--------------------------------------
        //调用原本的test同步方法
        a.test();
        //--------------------------------------
        System.out.println("提交事务操作");
    }
```

即spring利用aop自动帮我们的业务代码做了开启事务和提交事务的操作。而中间的代码，才真正执行我们的业务代码。 如此，在这段代码里里面，是先开启事务，才进入同步锁的。 下面看这个类：

```
@Service
public class TestService{
    @Transactional
    public synchronized void test() {
        //代码1
        System.out.println("数据库操作1");
        //代码2
        System.out.println("数据库操作2");
    }
}
```

这段代码中Test类被声明为bean，那么synchronized锁住的其实是整个类，在执行方法中的代码1和2时，是保证能够线程同步的。

但是，假设线程A和B同时访问这个方法，如果A先执行完了代码1、2，释放了同步锁，正准备提交事务的时候，B随即进入同步代码执行完了代码1、2，并与A同时提交了事务。那就会出现问题了，同步性不能被保证了。

解决办法是这样，在标注事务注解的方法的外部包一层同步锁，就可以将同步锁的作用域放在事务操作的外层，就避免了这种情况：

```
@Service
public class TestService{
    @Transactional
    public void test() {
        //代码1
        System.out.println("数据库操作1");
        //代码2
        System.out.println("数据库操作2");
    }
}

@Service
public class Test{
   @Autowired
   private TestService testService;

   public void test1(){
      synchronized {
        testService.test();
      }
   }
}
```