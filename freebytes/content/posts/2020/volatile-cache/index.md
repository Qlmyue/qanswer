---
title: "volatile关键字与内存模型"
slug: volatile-cache
date: 2020-07-04 11:53:13
category: java
tags: [java, java, 并发, 精品]
summary: "对volatile关键字的理解，与java的内存模型的概念是分不开的。volatile保证了变量操作的可见性和有序性，但是有使用场景的限制。"
status: published
views: 1474
---

对volatile关键字的理解，与java的内存模型的概念是分不开的。

### 从内存模型说起

java中有个概念叫内存模型，大体是这样的一种结构：

[

![](https://www.freebytes.net/wp-content/uploads/2020/07/image.png)

]()java内存模型

java内存模型规定了所有的变量都存储在主内存中，即是虚拟机内存的一部分。

每条线程拥有自己的工作内存，线程不能直接读写主内存中的变量，必须先从主内存中拷贝所需变量的副本到自己的工作内存中，其对变量的所有操作都在工作内存中完成，完成后再将最新的变量值写入到主内存中。

线程之间无法直接访问对方工作内存中的变量，线程之间变量值的传递只能通过主内存来完成。

Save和Load操作分别表示写入和读取操作。

那么为什么会有这样的一种模型呢？

这本质上是因为现代的存储设备跟处理器的运算速度相差地太远了。处理器的速度很快，负责数据的运算处理，但是它不存储数据，存储设备才负责存储数据。如果处理器直接从存储设备中取出数据、进行计算、再将结果放回到存储设备，这整个过程的运行效率就会受限于存储设备的读写速度。基于此，所有的现代计算机系统都不得不加入一层读写速度尽可能接近处理器运算速度的高速缓存（Cache）来作为内存与处理器之间的缓冲。

例如：

```
int static count = 0;
for(int i=0;i<10000;i++){
  count++;
}
```

上面一段代码，运行了一万次，如果没有缓存，那么每次进行count++操作的时候，都需要从存储设备中读取count的当前值，然后在cpu中计算++操作呢，然后再将结果放回存储设备。这个过程是相当慢的。

但是有了缓存之后，它的操作过程就变成这样了：

1. count初始化时，将count从存储设备中复制一份到缓存中。
2. cpu在从缓存中读取count，然后进行循环的++操作。
3. cpu将缓存中的变量结果重新写入到存储设备中。

而，java内存模型中的主内存，就对应着这里的存储设备内存，工作内存就对应着缓存。所以它是为了能准确利用到计算机的缓存机制而设定的一套针对高效读写运算的解决方案的规范。

### 由内存模型引发的问题

更确切的说，是由缓存机制引发的问题。看如下代码： （代码清单1-1） 

```
public class TestCount {
    public static int count =0;

    public static void main(String[] args) throws InterruptedException {
        for (int i = 0; i < 10; i++) {
            Thread thread = new Thread(new TestC());
            thread.start();
        }
        Thread.sleep(5000);
        System.out.println(count);
    }
}

class TestC implements Runnable{
    @Override
    public void run() {
        for (int i = 0; i < 10000; i++) {
            TestCount.count++;
        }
    }
}
```

10个线程同时对count进行++操作，每个线程都从主内存中拷贝count到自己的工作内存，然后进行高速的运算，最终得到的值有可能是100000，但更有可能是小于100000的数。原因是这样的：

每个线程从主内存中拷贝count值到工作内存之后，从工作内存中提取count，然后将count+1，然后再将count+1的结果写入到工作内存，如此循环。这个工作内存中的count值不一定会在每次循环中都写回到主内存，要看当前的计算机运算压力而定；线程读取count值，也不一定每次都是从工作内存中读取，也有可能从主内存中读取，这也取决于当前计算机的运算压力程度。

所以最终的值，往往既不会是10000，也不会是100000。

这就是由缓存机制引发的“缓存一致性问题”。

### volatile与可见性

解决缓存一致性问题，需要保证变量操作的原子性、可见性和有序性原则。暂且不提这三大特性，先来看volatile是如何使用的吧，且看以下代码（代码清单1-2）：

```
public class TestVolatie1 {

    public static  boolean remark = false;

    public static void main(String[] args) throws InterruptedException {
        Thread thread = new Thread(new TestA());
        thread.start();
        Thread.sleep(1000);
        remark = true;
    }
}

class TestA implements Runnable {
    @Override
    public void run() {
        while (true) {
            if (TestVolatie1.remark) {
                System.out.println("触发方法");
            }
        }
    }
}
//控制台输出：

```

理论上来说，当代码执行到remark=true，线程就会打印出“触发方法”。但实际上则是控制台什么都没有打印。 

这时候，将其中的一句代码`public static  boolean remark = false;`改为`public static volatile boolean remark = false;`仅仅增加了一个volatile关键字，却使得程序的运行结果正常了：在1秒钟后，控制台不停地打印“触发方法”。

关键字volatile可以说是java虚拟机提供的最轻量级的同步机制。当一个变量被定义为volatile之后，它将具备两种特性，第一是保证此变量对所有线程的可见性，第二是禁止指令重排序优化。

第一个特性足以解释，上述代码为何只加了volatile就能执行正常。这里的“可见性”是指，当一条线程修改了这个变量的值，新值对于其他线程来说是可以立即得知的。volatile保证一个变量修改后能将新值同步回主内存，并且该变量被线程读取前，能够立即从主内存中刷新变量值。

如果你不想用volatile，还可以怎么做？你可以将线程的run方法声明为synchronize，当然这样会比较耗费性能。也有另一种有趣的方案，将TestA.java改为：

```
class TestA implements Runnable {
    @Override
    public void run() {
        while (true) {
            try {
                Thread.sleep(1);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            if (TestVolatie1.remark) {
                System.out.println("触发方法");
            }
        }
    }
}
//控制台输出
触发方法
触发方法
触发方法
触发方法
触发方法
触发方法
...
```

仅在线程类中插入了一句线程睡眠1毫秒的代码，结果竟然使得程序执行正常了。

这是因为，while（true）{}是一个高速运行的循环，导致计算机无暇从主内存中去读取remark值，因此remark值一直是未被刷新的false。但是如果在while循环内增加了一句线程睡眠的代码，就使得计算机的运算压力减轻了，所以能够从主内存中重新读取remark值。

当然，谁会在代码里面写一句Thread.sleep()来解决并发问题呢。所以一般还是会用volatile来解决。

### volatile与有序性

使用volatile变量的第二个语义是禁止指令重排序优化。重排序优化其实是机器级的优化操作，如果从java的层面上去理解，那大体上可以这样表达：一段代码中的变量赋值代码语句，可能会优先于其他代码语句执行。例如：

```
    String message="freebytes.net";
    public void test() {
        System.out.println(message);       //语句1
        doSomething();                     //语句2
        message = "www.freebytes.net";     //语句3
    }
```

这段代码在单线程环境执行时，执行顺序自然是：语句1、语句2、语句3。但是在多线程环境下，有可能会变成：语句1、语句3、语句2。

那它会不会变成“语句3、语句1、语句2”这样的顺序呢？如果会的话，System.out.println(message)输出的值岂不是乱套了？

答案是不会。普通的变量虽然不能保证变量赋值操作的顺序与程序代码中的执行顺序一致，但是却能保证代码执行过程中所有依赖赋值结果的地方都能获得正确的结果。基于此，这段代码无论怎样运行都不会出现问题。

但是，换一段代码来看：（代码清单1-4）

```
public class TestVolatile2 {
    static boolean remark = false;

    public static void main(String[] args) {
        new Thread(new TestThread()).start();     //语句1
        new TestVolatile2().doSomeThing();        //语句2
        remark = true;                            //语句3
    }

    private void doSomeThing() {
        try {
            Thread.sleep(1);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}

class TestThread implements Runnable{
    @Override
    public void run() {
        while (!TestVolatile2.remark){
            System.out.println("正在上班.....");
        }
        System.out.println("下班了！！！");
    }
}

```

在主线程内，三条语句的执行顺序可能会是：语句3、语句1、语句2。线程TestThread内在while (!TestVolatile2.remark)语句中用到了remark值，但因为对remark的赋值和使用不在同一个线程内，所以不能保证它获取到的remark值一定是准确的，就可能会是true。这样就会使得System.out.println("下班了！！！")语句被提前执行。

而volatile关键字，可以避免此类情况的发生。将static  boolean remark = false，改为static volatile boolean remark = false。volatile通过禁止了指令重排序优化，从而保证了并发操作时代码执行的有序性。synchronize关键字也同样具有保证有序性的功能。

### volatile的使用场景限制

既然volatile这么强大，既能保证可见性又能保证有序性，那是不是所有的并发场景都可以利用它呢？

当然不是。 

回看到代码清单1-1，将其改成如下代码：（代码清单1-3）

```
public class TestCount {
    public static volatile int count =0;

    public static void main(String[] args) throws InterruptedException {
        for (int i = 0; i < 10; i++) {
            Thread thread = new Thread(new TestC());
            thread.start();
        }
        while (Thread.activeCount()>1){}
        System.out.println(count);
    }
}

class TestC implements Runnable{
    @Override
    public void run() {
        for (int i = 0; i < 10000; i++) {
            TestCount.count++;
        }
    }
}
```

对count变量增加了声明volatile，这样就能使得输出结果为100000了吗？

程序输出结果：91298

为什么呢？明明volatile保证了count变量的可见性了呀，所有线程每次操作的count值都应该是最新的才对啊。

这就要深入到更底层的角度去理解了。volatile使得线程对count的读取是从主内存中操作的，这个没错。但是会有这么一种情况：

首先，线程1和线程2同时执行到TestCount.count++这句代码（ 此时count=10 ），在执行这个++运算时，它们都需要再次读取count值。如果线程1先完成了读取和运算操作，并且在线程2读取前将新值1写回主内存，自然不会有问题，count会变成12。但是如果线程1还没来得及将count=11同步回主内存时，线程2读取到了count=10，那么，两个线程就相当于做了重复的一次++操作。所有说，最后的count值总是小于100000的。

所以说，volatile能保证变量操作的可见性，却不能保证原子性，遇到这种场景，依然需要使用synchronize来解决。如：

```
synchronized (lock){
   TestCount.count++;
}
```

如要使用volatile声明变量，最好能够保证，运算结果并不依赖变量的当前值，或者能够确保只有单一的线程修改变量的值。

### volatile与synchronize的区别

volatile与synchronize在不同层面上实现对并发的控制：

1. volatile的本质是告诉jvm当前变量的值需要从主存中读取，而synchronize在同一时间只允许一个线程访问该变量。
2.  volatile保证可见性和有序性，而synchronize保证可见性和原子性。 
3. volatile仅能支持声明变量，synchronized则可以使用在变量、方法上。  
4. volatile不会造成线程阻塞，synchronized会造成线程阻塞 。
5. volatile有严格的使用场景限制。