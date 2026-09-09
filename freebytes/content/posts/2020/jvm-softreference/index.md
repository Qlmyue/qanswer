---
title: "软引用对象的使用"
slug: jvm-softreference
date: 2020-06-30 07:15:08
category: java
tags: [java, java, jvm]
summary: "如果一个对象具有软引用，内存空间足够，垃圾回收器就不会回收它；如果内存空间不足了，就会回收这些对象的内存。这通常能够用在缓存删除的场景，让缓存对象实现软引用，那么在内存不够的时候，缓存对象就能被回收，释放内存。"
status: published
views: 1505
---

如果一个对象具有软引用，内存空间足够，垃圾回收器就不会回收它；如果内存空间不足了，就会回收这些对象的内存。这通常能够用在缓存删除的场景，让缓存对象实现软引用，那么在内存不够的时候，缓存对象就能被回收，释放内存。

### 案例1，不使用软引用

jvm参数设置：-Xms5M -Xmx5M -XX:+PrintGCDetails -XX:NewRatio=1；
将堆内存设置为5M，并且新生代为2.5M。

```
public class TestSoftReference1 {

    public static void main(String[] args) {
        List<byte[]> bytes= new ArrayList<>();
        TestSoftReference1 test = new TestSoftReference1();
        for (int i = 0; i < 6; i++) {
            System.out.println("执行第"+(i+1)+"次");
            test.testSoft(bytes);
        }
    }

    void testSoft(List list) {
        //分配1M大小的内存给数组对象
        byte[] buffer = new byte[1024 * 1024 * 1];
        list.add(buffer);
    }
}
//程序运行到第4次循环时，爆出OOM错误
```

### 案例2，使用软引用

```
public class TestSoftReference2 {

    public static void main(String[] args) {
        List<SoftReference> list = new ArrayList<>();
        TestSoftReference2 test = new TestSoftReference2();
        for (int i = 0; i < 6; i++) {
            System.out.println("执行第"+(i+1)+"次");
            test.testSoft(list);
        }
        for (SoftReference sr: list) {
            System.out.println(sr.get());
        }
    }

    void testSoft(List list) {
        //分配1M大小的内存给数组对象
        byte[] buffer = new byte[1024 * 1024 * 1];
        SoftReference sr = new SoftReference<byte[]>(buffer);
        list.add(sr);
    }
}
//程序执行正常
```

其中，SoftReference sr = new SoftReference(buffer)就是将对象变为软引用对象的方式。而sr.get()，就可以将获取到原来的buffer对象。

在该程序中，for循环语句块中，System.out.println(sr.get())语句的输出结果是：

```
null
null
null
[B@2437c6dc
[B@1f89ab83
[B@e73f9ac
```

表明在List<SoftReference> list数组内，有三个数组对象被回收了，也就是有三个1M大小的byte数组对象被回收了。