---
title: "关于join()的一个小坑"
slug: thread-join
date: 2020-07-15 09:01:52
category: java
tags: [java, java, 并发]
summary: "如果子线程中要进行比较耗时的运算，并且希望主线程等待子线程执行完毕之后再执行，那么就可以使用join()方法."
status: published
views: 1640
---

很多情况下，主线程创建并启动子线程，如果子线程中要进行比较耗时的运算，并且希望主线程等待子线程执行完毕之后再执行。那么就可以使用join()方法，它是线程类Thread的一个用于等待线程对象销毁的方法，底层是wait()方法。

join()的使用比较简单，但是有个小坑需要注意一下。

下面看这个例子：

```
public class TestJoin {
    public static void main(String[] args) throws InterruptedException {
        ThreadJoin threadJoin = new ThreadJoin();
        threadJoin.start();
        threadJoin.join(1000);
        System.out.println("main结束----------");
    }
}

class ThreadJoin extends Thread {
    @Override
    public  void run() {
        System.out.println("线程开始-------");
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("线程结束-------");
    }
}

```

程序的输出结果是——

```
线程开始-------
main结束----------
线程结束-------
```

结果是正常的，因为join(1000)表示主线程最多只等待子线程1秒的时间。

但是如果给线程类的run方法添加一个同步锁——

```
    @Override
    public synchronized void run() {
        System.out.println("线程开始-------");
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("线程结束-------");
    }
```

那么输出的结果就会变成——

```
线程开始-------
线程结束-------
main结束----------
```

可见，主线程虽然通过join(1000)声明只等待子线程1秒的时间，但实际上却是等子线程执行完毕了，一共2秒的时间。这是为什么呢？

看一下join()的源码——

```
public final synchronized void join(long millis)
    throws InterruptedException {
        long base = System.currentTimeMillis();
        long now = 0;

        if (millis < 0) {
            throw new IllegalArgumentException("timeout value is negative");
        }

        if (millis == 0) {
            while (isAlive()) {
                wait(0);
            }
        } else {
            while (isAlive()) {
                long delay = millis - now;
                if (delay <= 0) {
                    break;
                }
                wait(delay);
                now = System.currentTimeMillis() - base;
            }
        }
    }
```

join方法声明了一个synchronized，可见join是同步方法，锁住的对象监视器是线程对象本身。而ThreadJoin线程的run方法也是同步的，锁住的也是线程对象本身。

因此，在这个例子中，threadJoin.start()语句就和threadJoin.join(1000)语句互相争抢锁， threadJoin.start() 先抢到了， threadJoin.join(1000) 就不能执行，只能等到 threadJoin 的run方法执行完毕之后再执行。