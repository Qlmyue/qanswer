---
title: "理解CAS"
slug: learn-cas
date: 2020-08-01 09:12:42
category: java
tags: [java, java, 并发, 精品]
status: published
views: 1492
---

### 简介

众所周知，synchronize能够保证数据操作的原子性，从而实现同步效果。但是这种通过多个线程竞争锁的方式其效率会比较差，于是java另外实现了另一种无锁的却能保证数据操作原子性的方式——CAS（Compare-and-swap）。

### CAS的原理

Compare-and-swap，是一个针对非抢占式微处理器的一条指定指令的宽泛术语，这条指令读取内存的位置，比较独到的值和期望的值，当读到的值等于期望的值时，就将新值写入到该内存位置；否则，不做理会。

说的通俗点就是，线程在修改一个变量值时，首先判断这个变量有没有被修改过，如果没有，那就执行修改。

比如：多个线程同时修改一个值（count=0）时，每个线程的工作内存中都有这个值的副本（count=0），当线程开始对其进行修改时，先把0作为一个期望值，与主内存中count的实际值相比较，如果主内存中的值确实等于期望值，那么才可以进行对这个值的修改，并将修改后的值再次写入主内存中，这便是一次比较并交换的过程(注意：这个过程是原子性的，下文会提到)；然而如果期望值不等于实际值，该线程需要重新从主内存中获取count的值，以便用于下一次的比较交换操作。

### 案例

下面通过实际例子加深理解——

现在有10000个线程对变量int i = 0进行i++操作，如果不加任何同步，那么有可能最终打印出的i的值是小于10000的数字。

```
public class Test {

    static int count = 0;

    public static void main(String[] argv) {
        for (int i = 0; i < 10000; i++) {
            TestThread thread = new TestThread();
            thread.start();
        }
        while (Thread.activeCount()>1){
        }
        System.out.println(count);
    }
}

class TestThread extends Thread {
    @Override
    public void run() {
        Test.count++;
    }
}

输出：
9999
```

最简单的解决方法就是给线程类的Test.count++语句加上synchronize锁，但CAS是如何解决的呢？

这是一个以CAS作为底层的原子类AtomicInteger的应用案例——

```
public class TestCAS {
    static AtomicInteger count = new AtomicInteger(0);

    public static void main(String[] args) {
        for (int i = 0; i < 10000; i++) {
            TestCASThread thread = new TestCASThread();
            thread.start();
        }
        while (Thread.activeCount()>1){
        }
        System.out.println(count.get());
    }
}

class TestCASThread extends Thread {
    @Override
    public void run() {
        TestCAS.count.incrementAndGet();
    }
}

输出：
10000
```

incrementAndGet()方法，是递增1的意思。它的底层调用的是Unsafe类的compareAndSwapInt()方法——

```
    public final int getAndAddInt(Object var1, long var2, int var4) {
        int var5;
        do {
            var5 = this.getIntVolatile(var1, var2);
        } while(!this.compareAndSwapInt(var1, var2, var5, var5 + var4));

        return var5;
    }
```

由于这个Unsafe类没有源码，所以只能看到class文件的反编译代码，挺难看的，但能够看出，它在循环访问compareAndSwapInt()方法，进行重复的比较交换，比较交换成功之后才返回值。

compareAndSwapInt() 方法以原子的方式执行下列指令的序列：

```
//获取内存中的实际值
int readValue = value;
//将期望值与实际值进行比较，如果相同，就将其修改
if( readValue == expectedValue ){
   value = newValue;
}
//期望值与实际值不同，证明该值已被其他线程修改，返回实际值
return readValue;
```

也就是说，CAS的读-改-写序列，是一个原子性操作，也只有这样，才能保证线程在对变量进行比较交换的过程中，不会出现脏读的情况。

### CAS的缺陷

缺陷一：cas身为一种乐观锁，只能适用在并发数不算高的场景。因为cas的一个特点就是，在一个线程对变量进行比较并交换的操作时，其他线程都在循环获取变量最新的值，那么当并发数太大的时候，会对cpu造成太高的消耗。

缺陷二：ABA问题。假设变量i的初始值为A， 两个线程同时修改i，只有当i的期望值等于A时，才能成功。这种情况下，通常只有一个线程能够修改成功。但是存在这样一种特殊情况——
1、线程1希望将变量i从A修改为B，线程2希望将变量i从A修改为C。
2、线程1先一步将i的值从A修改为了B。
3、这时有另外的线程3一次将i的值从B修改为了A。
4、线程2获取i的值，发现跟期望值A一致，于是将变量i从A修改为了C。

最后一步，当线程2获取到i的实际值时，虽然与期望值一致，但是其实i的值已经不是原来的A了，而是经过2次变换之后的A，此A非彼A。

如果只是将cas用在简单的数据计算上，那么即时有ABA问题，也不影响数据的正确结果。但是在某些场景下，是会出大问题的。要解决这个ABA的问题，可以使用java中的另一个原子类AtomicStampedReference。

这个类的实现思想是，不再单纯地把数据的实际值当做用于比较的值，而是在这基础上增加了版本号（时间戳）的概念，每一次值的改变，都要更新版本号的信息，然后在每一次的比较并交换过程中，比较的不仅是对象的实际值，还有值的版本号。