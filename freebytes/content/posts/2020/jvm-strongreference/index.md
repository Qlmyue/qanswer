---
title: "强引用对象并非不会被回收"
slug: jvm-strongreference
date: 2020-06-30 06:48:02
category: java
tags: [java, java, jvm]
summary: "java中的强引用对象并非永远不会被回收，只要该引用被显示的设置为null，或者超出了代码执行的作用域而又没有被外界所引用时，就是可以被回收的。"
status: published
views: 2062
---

在《深入理解java虚拟机》第二版中第3章，有写到：

> 

强引用就是指在程序代码之中普遍存在的，类似“Object obj = new Object()”这类的引用，只要强引用还存在，垃圾收集器永远不会回收掉被引用的对象。《深入理解java虚拟机》

这段话很容易让人理解成， 类似“Object obj = new Object()”这样的代码声明的obj对象，永远不会被GC回收掉。但是在我们的日常编码中，这样的代码比比皆是，如果都不会回收，那么堆内存早就爆满了。

这段话，真正的意思其实说，垃圾收集器永远不会回收具有强引用的并且还存活着的对象。当一个普通对象没有其他引用关系，只要超过了引用的作用域或者显示的将引用赋值为null时，你的对象就表明不是存活着，这样就会可以被GC回收了。

下面通过几段案例代码，来做更好的解读——

### 案例1

jvm参数设置：-Xms5M -Xmx5M -XX:+PrintGCDetails -XX:NewRatio=1；
将堆内存设置为5M，并且新生代为2.5M。

```
public class TestStrongReference1 {
    public static void main(String[] args) {
        byte[] buffer = new byte[1024 * 1024 * 1];
        byte[] buffer1 = new byte[1024 * 1024 * 1];
        byte[] buffer2 = new byte[1024 * 1024 * 1];
        byte[] buffer3 = new byte[1024 * 1024 * 1];
    }
}

//控制台输出部分内容
Exception in thread "main" java.lang.OutOfMemoryError: Java heap space
	at cn.qian.jvm.TestStrongReference1.main(TestStrongReference1.java:11)
```

代码在执行到第11行，也就是byte[] buffer3 = new byte[1024 * 1024 * 1]的时候出现了OOM错误。每个byte数组都被分配到了1M的内存，这里分配了4个数组，也就是占用了4M。照理说拥有5M内存的堆空间足够容纳这些数组，但是因为堆空间原本就拥有一些对象数据，占用了一些空间，以及堆空间内分代分区的原因，造成了堆内存的利用率达不到百分百。因此堆内只能容纳三个1M大小的数组。

这个程序抛出了OOM错误，也就表明了，这些数组对象不能被GC回收，这也就符合了存活的强引用对象不会被回收的理论。

而如果将其中的代码改为：

```
    public static void main(String[] args) {
        byte[] buffer = new byte[1024 * 1024 * 1];
        byte[] buffer1 = new byte[1024 * 1024 * 1];
        byte[] buffer2 = new byte[1024 * 1024 * 1];
        buffer=null;
        byte[] buffer3 = new byte[1024 * 1024 * 1];
    }
```

将其中一个数组适时的显示地设置为null，就会使得该对象的强引用失效，可以被GC回收，所以程序不会出现OOM错误。

### 案例2

jvm设置：-Xms5M -Xmx5M -XX:+PrintGCDetails -XX:NewRatio=1；
将堆内存设置为5M，并且新生代为2.5M。 

```
public class TestStrongReference2 {
    public static void main(String[] args) {
        for (int i = 0; i < 6; i++) {
            byte[] buffer = new byte[1024 * 1024 * 1];
        }
    }
}
//控制台输出了正常的日志，没有OOM错误
```

这样的代码中，声明了6M的数组，明显超出了堆空间，但是却没有出现问题。表明byte数组对象是可以被GC回收的。那这样的代码跟上个案例的代码有什么区别呢？

for语句中，每一次的循环都会进入一个新的作用域，而每个byte数组对象只存在于当前作用域中，没有被外界的作用域所引用，所以当出了作用域后，它本身就不算是存活对象了，可以被回收。

### 案例3

 jvm设置：-Xms5M -Xmx5M -XX:+PrintGCDetails -XX:NewRatio=1；
将堆内存设置为5M，并且新生代为2.5M。 

```
public class TestStrongReference3 {
    public static void main(String[] args) {
        TestStrongReference3 reference = new TestStrongReference3();
        reference.test1();
        reference.test2();
        reference.test3();
        reference.test4();
        reference.test5();
        reference.test6();
    }
    void test1(){
        byte[] bytes = new byte[1024 * 1024 * 1];
    }
    void test2(){
        byte[] bytes = new byte[1024 * 1024 * 1];
    }
    void test3(){
        byte[] bytes = new byte[1024 * 1024 * 1];
    }
    void test4(){
        byte[] bytes = new byte[1024 * 1024 * 1];
    }
    void test5(){
        byte[] bytes = new byte[1024 * 1024 * 1];
    }
    void test6(){
        byte[] bytes = new byte[1024 * 1024 * 1];
    }
}
//控制台输出了正常的日志，没有OOM错误
```

这个案例也总共声明了6M的内存，但是却没有OOM。其实这也是作用域的原因。 在jvm中，一个方法被执行的时候就会创建一个栈帧，放入到虚拟机栈中，方法的执行至结束对应着栈帧的入栈至出栈的过程。每一个test方法执行完毕，栈帧也就被销毁了， 里面的byte引用也就不存在了，所以可以被GC回收了。