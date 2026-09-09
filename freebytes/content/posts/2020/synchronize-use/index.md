---
title: "synchronize可以锁住一个方法？"
slug: synchronize-use
date: 2020-07-08 03:52:17
category: java
tags: [java, java, 并发, 精品]
summary: "synchronize锁住的其实不是一个方法、一段代码，而是一个对象或者一个class类。"
status: published
views: 1356
---

记得有一次在面试一个实习生的时候，闻到了一个synchronize的相关问题，他提到“synchronize通过锁住一个方法或者一段代码实现同步效果”。这句话从表面上看其实也没有什么问题，毕竟从代码上看就是这么回事——

```
    public synchronized void run() {
        for (int i = 0; i < 1000; i++) {
            TestSynchronize4.count++;
        }
    }

    synchronized (TestSynchronize1.class) {
         for (int i = 0; i < 1000; i++) {
              TestSynchronize1.count++;
         }
    }
```

但如果是对synchronize稍微有研究的人，是不会这样说的。因为synchronize锁住的其实不是一个方法、一段代码，而是一个对象或者一个class类。

我们可以从synchronize的几种应用场景中，加深对其的理解。

### 案例1

```
public class TestSynchronize1 {
    public static int count = 0;

    public static void main(String[] args) {
        for (int i = 0; i < 100; i++) {
            Thread1 thread = new Thread1();
            thread.start();
        }
        while (Thread.activeCount() > 1) {
        }
        System.out.println(count);
    }
}

class Thread1 extends Thread {
    @Override
    public void run() {
//        synchronized (Object.class) {
        synchronized (TestSynchronize1.class) {
            //锁住一个class类，理论上任何class都可以
            for (int i = 0; i < 1000; i++) {
                TestSynchronize1.count++;
            }
        }
    }
}
```

这里锁住的是一个class类，理论上任何class都可以作为锁对象。

### 案例2

```
public class TestSynchronize2 {
    public static int count = 0;
    public static TestSynchronize2 test=new TestSynchronize2();
    public static void main(String[] args) {
        for (int i = 0; i < 100; i++) {
            Thread2 thread = new Thread2();
            thread.start();
        }
        while (Thread.activeCount() > 1) {
        }
        System.out.println(count);
    }
}

class Thread2 extends Thread {
    @Override
    public void run() {
        synchronized (TestSynchronize2.test) {
            //锁住了一个线程共享的对象
            for (int i = 0; i < 1000; i++) {
                TestSynchronize2.count++;
            }
        }
    }
}
```

这里锁住了一个线程共享的对象（线程共享static变量），理论上任何对象都可以，但如果该对象不是线程共享的，就会产生并发问题。

### 案例3

```
public class TestSynchronize3 {
    public static int count = 0;

    public static void main(String[] args) {
        for (int i = 0; i < 100; i++) {
            Thread3 thread = new Thread3();
            thread.start();
        }
        while (Thread.activeCount() > 1) {
        }
        System.out.println(count);
    }
}

class Thread3 extends Thread {
    @Override
    public void run() {
        synchronized (this) {
            //锁住了一个对象，等同于锁住了Thread3的对象本身
            for (int i = 0; i < 1000; i++) {
                TestSynchronize3.count++;
            }
        }
    }
}
```

这里锁住了一个this，等同于锁住了Thread3的对象本身，但这个对象不是线程共享的，所以会出现并发问题。

### 案例4

```
public class TestSynchronize4 {
    public static int count = 0;

    public static void main(String[] args) {
        for (int i = 0; i < 100; i++) {
            Thread4 thread = new Thread4();
            thread.start();
        }
        while (Thread.activeCount() > 1) {
        }
        System.out.println(count);
    }
}

class Thread4 extends Thread {
    @Override
    public synchronized void run() {
        //看起来是锁住了一个方法，但其实等同于synchronized (this)，锁住了当前对象
        //如果该方法是静态的，那么等同于synchronized (Thread4.class)，锁住当前类的class类
        for (int i = 0; i < 1000; i++) {
            TestSynchronize4.count++;
        }
    }
}
```

看起来是锁住了一个方法，但其实等同于synchronized (this)，锁住了当前对象。     如果该方法是静态的，那么等同于synchronized (Thread4.class)，锁住当前类的class类。

### 案例5

```
public class TestSynchronize5 {

    public static void main(String[] args) {
        Service1 service1 = new Service1();
        service1.start();
        Service2 service2 = new Service2();
        service2.start();
    }
}

class Service1 extends Thread {
    @Override
    public void run() {
        //即使两个不同的线程，由于用了同一个锁，也会实现同步的效果
        synchronized (TestSynchronize5.class) {
            System.out.println("线程---"+Thread.currentThread().getName()+"---进入");
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("线程---"+Thread.currentThread().getName()+"---退出");
        }
    }
}

class Service2 extends Thread {
    @Override
    public void run() {
        //即使两个不同的线程，由于用了同一个锁，也会实现同步的效果
        synchronized (TestSynchronize5.class) {
            System.out.println("线程---"+Thread.currentThread().getName()+"---进入");
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("线程---"+Thread.currentThread().getName()+"---退出");
        }
    }
}
```

```
控制台输出：
线程---Thread-0---进入
线程---Thread-0---退出
线程---Thread-1---进入
线程---Thread-1---退出
```

这里是正常的，没有出现并发问题。说明即使两个不同的线程，由于用了同一个对象锁，也能够实现同步的效果。