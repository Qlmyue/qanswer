---
title: "InheritableThreadLocal"
slug: inheritablethreadlocal
date: 2021-01-06 01:15:04
category: java
tags: [java, java, 并发]
summary: "InheritableThreadLocal可将父线程中存储的值带到子线程中。"
status: published
views: 1661
---

InheritableThreadLocal继承于ThreadLocal，功能与ThreadLocal差不多；不同的是， InheritableThreadLocal 可以在子线程中获取到父线程设置的值。

```
public class ThreadContextChild {

    private static ThreadLocal<String> threadLocal = new ThreadLocal<>();
    private static ThreadLocal<String> inheritableThreadLocal = new InheritableThreadLocal<>();

    public static void main(String[] args) {
        //在父线程中设置值
        threadLocal.set(Thread.currentThread().getName());
        inheritableThreadLocal.set(Thread.currentThread().getName());
        new Thread(() -> {
            //在子线程中获取值
            //ThreadLocal无法获取父线程的值  输出为null
            System.out.println("threadLocal在子线程中获取父线程的值---------" + threadLocal.get());
            //InheritableThreadLocal做到了在子线程中获取父线程的值
            System.out.println("inheritableThreadLocal在子线程中获取父线程的值-----------" + inheritableThreadLocal.get());
        }).start();
    }
}
```

java中并没有真正的父子线程的概念，所谓的子线程，只是由当前线程下开启的新线程，在新线程初始化的时候，将当前线程的值传入给到它，看起来就像是有继承关系的父子一样。