---
title: "声明一个CPU密集型线程池，保证所有任务都能被执行完"
slug: tread-cool-cpu
date: 2021-12-30 08:49:46
category: java
tags: [java, java, 并发, 精品]
summary: "怎么声明一个线程池，使它能够执行大量CPU密集型操作，又不会无限创建新线程，又能保证所有的任务都能被执行完成呢？"
status: published
views: 1681
---

怎么声明一个线程池，使它能够执行大量CPU密集型操作，又不会无限创建新线程，又能保证所有的任务都能被执行完成呢？

先看下jdk中，声明线程池的API：

```
public ThreadPoolExecutor(int corePoolSize,
                              int maximumPoolSize,
                              long keepAliveTime,
                              TimeUnit unit,
                              BlockingQueue<Runnable> workQueue,
                              ThreadFactory threadFactory,
                              RejectedExecutionHandler handler) 
```

几个重要的参数讲解：

**corePoolSize          **
线程池中保留的线程数
**maximumPoolSize **
线程池中允许存在的最大线程数
**keepAliveTime       **
空闲线程存活时间，只有在线程数量大于 corePoolSize的时候才会起作用
**BlockingQueue      **
任务队列，新任务被提交到此队列中，等待空闲线程去调度执行
**RejectedExecutionHandler **
拒绝策略，当队列满了，线程池的线程数达到最大时，如何处理新提交进来的任务

以下代码，声明了一个线程数和最大线程数均为poolSize、任务队列总数为100、任务队列为ArrayBlockingQueue、拒绝策略为CallerRunsPolicy的线程池。

```
public static ThreadPoolExecutor executor(int poolSize) {
   ThreadPoolExecutor executor = new ThreadPoolExecutor(poolSize, poolSize, 
            10, TimeUnit.SECONDS, new ArrayBlockingQueue(100, true),
            new BasicThreadFactory.Builder().
            namingPattern("schedule-pool-%d").daemon(false).build(),
            new ThreadPoolExecutor.CallerRunsPolicy());
    return executor;
}
```

此线程池，为cpu密集型的线程池，线程数量建议为cpu的核心数+1，因此，我一般这样调用上面的代码块：

```
//传入可用cpu的核心数+1 作为参数
executor(Runtime.getRuntime().availableProcessors() + 1);
```

之所以让corePoolSize 等于maximumPoolSize，是因为过多的线程对于cpu密集型操作而言，并没有意义。

这里声明了一个ArrayBlockingQueue有界队列，队列的长度为100。当被提交的任务数量超出corePoolSize的时候，会被置入到该队列中，成为等待任务。

如果等待任务数超出了队列的长度，后续的任务无法再放入到队列中，就会创建新的线程去执行后续的任务。可线程不会无限创建，等于maximumPoolSize时，就不会再创建。 这个时候就会执行CallerRunsPolicy拒绝策略。

CallerRunsPolicy，即使用主线程执行后续的任务，由于使用了主线程，也就是说会发生阻塞行为，但是可以确保任务不会被丢失。

这个线程池，将主线程也参与到了线程池的调度工作中，对于 ArrayBlockingQueue 队列中的任务，线程池中原有的线程处理不过来的时候，就可以直接调用主线程去处理。此时的 ArrayBlockingQueue的长度怎么设置其实已经没有太大关系，只要不比线程数量少就行。

实际开发中，可能会有必须等待线程池执行完毕才能进入下一步操作的需求。因此，可以在后面调用如下代码块：

```
public static void shutdownSafe(int delay, ThreadPoolExecutor executor) {
    executor.shutdown();
    try {
        executor.awaitTermination(delay, TimeUnit.SECONDS);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
    System.out.println("线程池已经关闭");
}

public static void shutdownSafe(ThreadPoolExecutor executor) {
    shutdownSafe(120, executor);
}
```