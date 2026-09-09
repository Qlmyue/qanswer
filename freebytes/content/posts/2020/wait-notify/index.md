---
title: "线程通信基础：wait和notify"
slug: wait-notify
date: 2020-07-13 10:15:51
category: java
tags: [java, java, 并发]
summary: "wait和notify方法是线程通信的基础，它们都只能在同步方法或同步块中使用。"
status: published
views: 1370
---

### wait()

方法wait()的作用是使当前执行代码的线程进行等待，它是Object类的方法，用来将当前线程置入“预执行队列”中，并且在wait()所在的代码行处停止执行，直到接到通知或被中断为止。

在调用wait()之前，线程必须获得该对象的对象级别锁，即只能在同步方法或同步块中调用wait()方法。在执行wait方法之后，当前线程释放锁。在从wait返回前，线程与其他线程竞争重新获得锁。

### notify()

方法notify()也要在同步方法或同步块中调用，即在调用前，线程也必须获得该对象的对象级别锁。如果调用notify()时没有持有适当的锁，会抛出异常。该方法用来通知那些可能等待该对象的对象锁的其他线程，如果有多个线程等待，则由线程规划器随机挑选出其中一个呈wait状态的线程，对其发出通知notify，并使它等待获取该对象的对象锁。

需要说明的是，在执行notify()方法后，当前线程不会马上释放对象锁，呈wait状态的线程也并不能马上获取该对象锁，要等到notify()方法的线程将程序执行完，也就是退出synchronize代码块后，当前线程才会释放锁，而呈wait状态所在的线程才可以获取该对象锁。

调用一次notify()只能唤醒一个wait状态的线程，如果需要全部唤醒，需要使用notifyAll()。

### 案例

```
package net.freebytes.multithread.wait;

/**
 * @date: 2020/7/13 17:43
 */
public class TestWait1 {

    public static void main(String[] args) {
        Object lock = new Object();
        new TestThread1(lock).start();
        new TestThread11(lock).start();
    }
}

class TestThread1 extends Thread {
    private Object lock;

    public TestThread1(Object lock) {
        this.lock = lock;
    }

    @Override
    public void run() {
        synchronized (lock) {
            System.out.println("wait方法开始执行...");
            try {
                lock.wait();
                Thread.sleep(10);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("wait方法结束执行...");
        }
    }
}

class TestThread11 extends Thread {
    private Object lock;

    public TestThread11(Object lock) {
        this.lock = lock;
    }

    @Override
    public void run() {
        synchronized (lock) {
            System.out.println("notify方法开始执行...");
            lock.notify();
            System.out.println("notify方法结束执行...");
        }
    }
}

//控制台输出
wait方法开始执行...
notify方法开始执行...
notify方法结束执行...
wait方法结束执行...
```

### wait()与sleep()的区别

wait()方法执行后，会释放锁，而Thread.sleep()方法执行后，不会释放锁。

### 注意

线程在wait()期间，可能会被调用interrupt()方法终断掉，这时候再使用notify()方法唤醒，就会抛出异常。

线程在wait()之前，被提前notify()，不会抛出异常，但是会影响程序的正常结果，要尽量避免这种情况。

线程执行完wait()语句就会立刻释放锁，但是线程执行完notify()语句后还不会释放锁，要等到notify()所在的同步代码块执行完毕之后才会释放。