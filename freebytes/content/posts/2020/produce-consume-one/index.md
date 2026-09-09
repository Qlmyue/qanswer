---
title: "回顾经典：生产者与消费者模式"
slug: produce-consume-one
date: 2020-07-15 07:03:20
category: java
tags: [java, java, 并发]
summary: "等待/通知模式最经典的案例就是“生产者/消费者”模式。但此模式在使用上有几种“变形”，但原理上都是基于wati/notify的。"
status: published
views: 1448
---

> 

等待/通知模式最经典的案例就是“生产者/消费者”模式。但此模式在使用上有几种“变形”，还有一些小的注意事项，但原理上都是基于wati/notify的。《Java多线程编程核心技术》

### 案例——1对1的生产者与消费者模式

创建一个消费者和一个生产者，生产者每生产一个产品，消费者就会去消费这个产品。在没有产品的情况下生产者才会去生产，在有产品的情况下消费者才会去消费。

```
/**
 * @date: 2020/7/14 17:37
 * 1个生产者与1个消费者
 */
public class ProduceAndConsume {
    /**
     * 可供消费的产品
     */
    public static volatile String value = "";

    public static void main(String[] args) throws InterruptedException {
        Object lock = new Object();
        ThreadProduce produce = new ThreadProduce(lock);
        ThreadConsume consume = new ThreadConsume(lock);
        produce.start();
        consume.start();
    }
}
```

```
/**
 * 生产者线程
 */
class ThreadProduce extends Thread {
    private Object lock;

    public ThreadProduce(Object lock) {
        this.lock = lock;
    }

    @Override
    public void run() {
        while (true) {
            synchronized (lock) {
                if (!ProduceAndConsume.value.equals("")) {
                    try {
                        lock.wait();
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
                long timeMillis = System.currentTimeMillis();
                ProduceAndConsume.value = timeMillis + "";
                System.out.println("生产线程" + Thread.currentThread().getName() + "生产了" + ProduceAndConsume.value);
                lock.notify();
            }
        }
    }
}
```

```
/**
 * 消费者线程
 */
class ThreadConsume extends Thread {
    private Object lock;

    public ThreadConsume(Object lock) {
        this.lock = lock;
    }

    @Override
    public void run() {
        while (true) {
            synchronized (lock) {
                if (ProduceAndConsume.value.equals("")) {
                    try {
                        lock.wait();
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
                System.out.println("消费线程" + Thread.currentThread().getName() + "消费了" + ProduceAndConsume.value);
                ProduceAndConsume.value = "";
                lock.notify();
            }
        }
    }
}
```

控制台输出：

```
生产线程Thread-0生产了1594799595268
消费线程Thread-1消费了1594799595268
生产线程Thread-0生产了1594799595269
消费线程Thread-1消费了1594799595269
...
```

### 案例——多对多的生产者与消费者模式

上面这种简单的应用场景，在1对1的模式下，生产者调用notify()唤醒的必然是消费者，消费者调用notify()唤醒的必然是生产者。所以才使得生产者线程与消费者线程井然有序地交替执行。

但是如果在多对多的模式下，即便是这种如此简单的应用场景，也是会出现问题的。

如，将ProduceAndConsume.java类改成如下：

```
public class ProduceAndConsume {
    /**
     * 可供消费的产品
     */
    public static volatile String value = "";

    public static void main(String[] args) throws InterruptedException {
        Object lock = new Object();
        for (int i = 0; i < 2; i++) {
            ThreadProduce produce = new ThreadProduce(lock);
            ThreadConsume consume = new ThreadConsume(lock);
            produce.start();
            consume.start();
        }
    }
}
```

结果输出：

```
生产线程Thread-0生产了1594799909824
消费线程Thread-3消费了1594799909824
消费线程Thread-1消费了
生产线程Thread-0生产了1594799909824
消费线程Thread-3消费了1594799909824
消费线程Thread-1消费了
生产线程Thread-0生产了1594799909824
消费线程Thread-3消费了1594799909824
消费线程Thread-1消费了
...
```

这是因为在notify()不保证唤醒的线程是哪个线程，有可能是同类线程，也可能是异类线程。，比如“生产者”唤醒“生产者”，或者“消费者”唤醒“消费者”。甚至，如果这样的情况运行的比率积少成多，就会导致所有的线程都不能继续运行下去，大家都在等待，都成WAITING状态，程序就无法运行下去了。

为了避免这样的情况，需要将程序做如下修改：

```
package net.freebytes.multithread.produceandconsume;

/**
 * @date: 2020/7/14 17:37
 * 多个生产者与多个消费者
 */
public class ProduceAndConsume2 {
    /**
     * 可供消费的商品
     */
    public static volatile String value = "";

    public static void main(String[] args) throws InterruptedException {
        Object lock = new Object();
        for (int i = 0; i < 2; i++) {
            ThreadProduce2 produce = new ThreadProduce2(lock);
            produce.setName("生产线程" + i);
            ThreadConsume2 consume = new ThreadConsume2(lock);
            consume.setName("消费线程" + i);
            produce.start();
            consume.start();
        }
    }
}

class ThreadProduce2 extends Thread {
    private Object lock;

    public ThreadProduce2(Object lock) {
        this.lock = lock;
    }

    @Override
    public void run() {
        while (true) {

            synchronized (lock) {
                while (!ProduceAndConsume.value.equals("")) {
                    try {
                        lock.wait();
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
                long timeMillis = System.currentTimeMillis();
                ProduceAndConsume.value = timeMillis + "";
                System.out.println(Thread.currentThread().getName() + "生产了" + ProduceAndConsume.value);
                lock.notifyAll();
            }
        }

    }
}

class ThreadConsume2 extends Thread {
    private Object lock;

    public ThreadConsume2(Object lock) {
        this.lock = lock;
    }

    @Override
    public void run() {
        while (true) {

            synchronized (lock) {
                while (ProduceAndConsume.value.equals("")) {
                    try {
                        lock.wait();
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
                System.out.println(Thread.currentThread().getName() + "消费了" + ProduceAndConsume.value);
                ProduceAndConsume.value = "";
                lock.notifyAll();
            }
        }

    }
}

```