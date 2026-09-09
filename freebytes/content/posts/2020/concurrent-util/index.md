---
title: "并发工具类的同步器"
slug: concurrent-util
date: 2020-07-24 03:36:29
category: java
tags: [java, java, 并发]
summary: "本文介绍JDK中并发工具类的各种同步器，倒计时门闩（countdown latch）、同步屏障（cyclic barrier）、交换器（exchanger）、信号量（semaphore）以及phaser同步器。"
status: published
views: 2089
---

本文介绍JDK中并发工具类的各种同步器，倒计时门闩（countdown latch）、同步屏障（cyclic barrier）、交换器（exchanger）、信号量（semaphore）以及phaser同步器。

### 一、倒计时门闩

java.util.concurrent.CountDownLatch同步器，其基本api如下：

```
//创建一个计数量为count的同步器    
public CountDownLatch(int count) {
        if (count < 0) throw new IllegalArgumentException("count < 0");
        this.sync = new Sync(count);
}

//线程调用该方法后，会进入阻塞状态，直到计数量变为0
public void await() throws InterruptedException {
        sync.acquireSharedInterruptibly(1);
}

//减少一个计数量
public void countDown() {
        sync.releaseShared(1);
}

//获取当前剩下的计数量
public long getCount() {
        return sync.getCount();
}
```

一般的应用场景是，主线程等待多个线程把各自的任务执行完毕，然后才开始执行自己的任务。如以下案例：举行人民代表大会前，需要等待多个领导人进场完毕，才能正式开始——

```
public class TestCountDown {
    //声明计数量为5的同步器
    private static CountDownLatch latch = new CountDownLatch(5);
    //声明一个线程池，数量多少并不影响
    private static ExecutorService exec = Executors.newFixedThreadPool(20);

    public static void main(String[] args) throws InterruptedException {
        System.out.println("-----------第9981界人民代表大会准备开始，有情诸位国家领导人入场-----------");
        for (int i = 1; i <= 5; i++) {
            exec.submit(() -> {
                //五个线程同时执行各自的任务，并将计数量-1
                System.out.println("领导人" + Thread.currentThread().getName() + "入场");
                latch.countDown();
            });
        }
        //同步器等待5个线程执行完毕
        latch.await();
        System.out.println("此时计数量="+latch.getCount());
        System.out.println("-----------人民代表大会正式开始-----------");
        exec.shutdown();
    }
}
```

输出如下——

```
-----------第9981界人民代表大会准备开始，有情诸位国家领导人入场-----------
领导人pool-1-thread-1入场
领导人pool-1-thread-3入场
领导人pool-1-thread-2入场
领导人pool-1-thread-4入场
领导人pool-1-thread-5入场
此时计数量=0
-----------人民代表大会正式开始-----------
```

可见，await方法会使得线程进入阻塞，直到计数量变为0；

### 二、同步屏障

java.util.concurrent.CyclicBarrier，这个类的中文意思是“循环栅栏”，表示一个可以重复使用的同步屏障。它的作用就是会让所有线程都等待最后一个线程，最后一个线程任务完成后，才会继续下一步行动。 基本API如下：

```
   //构造一个同步屏障，指定屏障对数量为parties的线程数有效，当最后一个线程到
   //达屏障时，barrierAction线程会被执行
 public CyclicBarrier(int parties, Runnable barrierAction) {
        if (parties <= 0) throw new IllegalArgumentException();
        this.parties = parties;
        this.count = parties;
        this.barrierCommand = barrierAction;
    }

//执行此方法后，线程会被阻塞，直到最后一个线程执行此方法
    public int await() throws InterruptedException, BrokenBarrierException {
        try {
            return dowait(false, 0L);
        } catch (TimeoutException toe) {
            throw new Error(toe); // cannot happen
        }
    }
```

通过一个简单案例，模拟多个线程共同等待最后一个线程的场景——

```
public class TestCyclicBarrier1 {
    public static void main(String[] args) {
        int count =10;
        CyclicBarrier barrier = new CyclicBarrier(count, new Runnable() {
            @Override
            public void run() {
                System.out.println("最后一个线程到达完毕");
            }
        });
        for (int i = 0; i < count; i++) {
            new Thread(new Runnable() {
                @Override
                public void run() {
                    try {
                        System.out.println(Thread.currentThread().getName()+"---------到达第1个屏障");
                        barrier.await();
                        Thread.sleep(1000);
                        System.out.println(Thread.currentThread().getName()+"---------到达第2个屏障");
                        barrier.await();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }).start();
        }
    }
}

```

输出如下——

```
Thread-1---------到达第1个屏障
Thread-0---------到达第1个屏障
Thread-2---------到达第1个屏障
Thread-3---------到达第1个屏障
Thread-4---------到达第1个屏障
Thread-6---------到达第1个屏障
Thread-7---------到达第1个屏障
Thread-8---------到达第1个屏障
Thread-5---------到达第1个屏障
Thread-9---------到达第1个屏障
最后一个线程到达完毕

Thread-0---------到达第2个屏障
Thread-2---------到达第2个屏障
Thread-1---------到达第2个屏障
Thread-9---------到达第2个屏障
Thread-5---------到达第2个屏障
Thread-8---------到达第2个屏障
Thread-7---------到达第2个屏障
Thread-6---------到达第2个屏障
Thread-4---------到达第2个屏障
Thread-3---------到达第2个屏障
最后一个线程到达完毕
```

可见，10个线程都执行完毕之后，才会运行最终的任务，并且这个屏障可以重复利用。

#### CyclicBarrier 使用场景

一般用于多线程计算数据，最后合并计算结果的场景。

#### CyclicBarrier 与 CountDownLatch 区别

CountDownLatch 是一次性的，CyclicBarrier 是可循环利用的。

###  三、交换器

java.util.concurrent.Exchanger实现了交换器， 它提供了一个线程彼此之间能够交换对象的同步点。 

Exchanger类中的主要方法就是：exchange(V x)方法，成对的两个线程之间，都调用了该方法，就能在两个线程彼此都准备好数据后，成功的交换数据给对方，然后各自返回。

简单案例：商人出售商品，消费者付钱，交换之后，商人获得钱，消费者获得商品——

```
public class TestExchanger {
    public static void main(String[] args) {
        final Exchanger<String> exchanger = new Exchanger<>();
        Thread businessman = new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    String product="游戏机卡带";
                    System.out.println("商人出售"+product);
                    String exchange = exchanger.exchange(product);
                    System.out.println("商人获得"+exchange);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });

        Thread consumer = new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    String price="100元";
                    System.out.println("消费者付给商人"+price+"-----------------");
                    Thread.sleep(2000);
                    String exchange = exchanger.exchange(price);
                    System.out.println("消费者获得"+exchange);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });

        businessman.start();
        consumer.start();
    }
}
```

### 四、信号量

java.util.concurrent.Semaphore，可以很轻松完成信号量控制，Semaphore可以控制某个资源可被同时访问的线程个数。线程通过 acquire() 获取一个许可，如果没有就等待，而 release() 释放一个许可。

基本API如下：

```
//创建一个信号数目为permits的信号量对象
 public Semaphore(int permits) {
        sync = new NonfairSync(permits);
 }

 //创建一个信号数目为permits的信号量对象，如果fair为true，那么等待许可的线程会按照先进先出的顺序，有序地获取许可
 public Semaphore(int permits, boolean fair) {
        sync = fair ? new FairSync(permits) : new NonfairSync(permits);
  }

//线程获取一个许可，如果获取不到，就进入阻塞状态，知道有许可可以被获取，或者该线程被中断
  public void acquire() throws InterruptedException {
        sync.acquireSharedInterruptibly(1);
  }

//线程释放一个许可
 public void release() {
        sync.releaseShared(1);
 }
```

案例——有一家广发银行开放5个窗口，有10个客户正在排队准备取钱：

```
public class TestSemaphore1 {
    static ExecutorService pool = Executors.newCachedThreadPool();
    Semaphore semaphore = new Semaphore(5,true);

    public static void main(String[] args) {
        TestSemaphore1 testSemaphore = new TestSemaphore1();
        for (int i = 1; i <= 10; i++) {
            Runnable r = () -> testSemaphore.getMoney();
            pool.execute(r);
        }
        pool.shutdown();
    }

    public void getMoney() {
        try {
            semaphore.acquire();
            System.out.println(Thread.currentThread().getName() + "进入柜台，开始取钱");
            Thread.sleep((long) (Math.random()*10000));
            System.out.println(Thread.currentThread().getName() + "离开柜台");
            semaphore.release();
            System.out.println("------------------------------------------"+semaphore.availablePermits());
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}

```

输出如下：

```
pool-1-thread-1进入柜台，开始取钱
pool-1-thread-2进入柜台，开始取钱
pool-1-thread-3进入柜台，开始取钱
pool-1-thread-4进入柜台，开始取钱
pool-1-thread-5进入柜台，开始取钱
pool-1-thread-2离开柜台
------------------------------------------1
pool-1-thread-6进入柜台，开始取钱
pool-1-thread-6离开柜台
------------------------------------------1
pool-1-thread-7进入柜台，开始取钱
pool-1-thread-4离开柜台
------------------------------------------1
pool-1-thread-8进入柜台，开始取钱
pool-1-thread-8离开柜台
------------------------------------------1
pool-1-thread-9进入柜台，开始取钱
pool-1-thread-3离开柜台
------------------------------------------1
pool-1-thread-10进入柜台，开始取钱
pool-1-thread-5离开柜台
------------------------------------------1
pool-1-thread-1离开柜台
------------------------------------------2
pool-1-thread-7离开柜台
------------------------------------------3
pool-1-thread-9离开柜台
------------------------------------------4
pool-1-thread-10离开柜台
------------------------------------------5
```

可见，刚开始时，同时有5个人进入5个窗口办理业务，期间每有一人离开，剩下的5个人就会补上一个空缺，到最后10人全部办完就剩下5个空余窗口了。

### 五、Phaser

java.util.concurrent.Phaser，其实比较像可重用的同步屏障CyclicBarrier，但是它更注重于“线程分阶段执行任务”的定位。它可以使得一组线程在执行一个多阶段任务时，其他线程都必须等待最后一个线程到达之后，才能整体进入下一个阶段。

关于这个知识点的讲解，有一篇博客讲得非常全面深入，我就不再赘述了，链接如下： [https://segmentfault.com/a/1190000015979879]() 

### 几个同步器的区别

![](https://www.freebytes.net/wp-content/uploads/2020/07/image-4.png)