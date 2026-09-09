---
title: "JVM日志分析之三"
slug: jvm-log-anaylise-3
date: 2020-06-24 01:46:55
category: java
tags: [java, java, jvm]
summary: "本文主要介绍对程序运行时打印的jvm日志进行的详细解析（三）。"
status: published
views: 1452
---

### 一、程序

```
public class Test3 {
    public static void main(String[] args) {
        byte[] b =null;
        for (int i = 0; i < 10; i++) {
            b=new byte[1*1024*1024];
        }
    }
}
```

### 二、JVM参数

jvm参数 :  -Xmx20m -Xms20m -Xmn7m -XX:+PrintGCDetails        
解释：设置堆内存最大最小值为20M，新生代内存为7M，打印详细的堆参数

### 三、程序运行日志

```
[GC (Allocation Failure) [PSYoungGen: 5381K->504K(6656K)] 5381K->1632K(19968K), 0.0014377 secs] [Times: user=0.00 sys=0.00, real=0.00 secs] 
[GC (Allocation Failure) [PSYoungGen: 5742K->504K(6656K)] 6870K->2696K(19968K), 0.0006764 secs] [Times: user=0.02 sys=0.02, real=0.00 secs] 
Heap
 PSYoungGen      total 6656K, used 1589K [0x00000000ff900000, 0x0000000100000000, 0x0000000100000000)
  eden space 6144K, 17% used [0x00000000ff900000,0x00000000ffa0f748,0x00000000fff00000)
  from space 512K, 98% used [0x00000000fff80000,0x00000000ffffe010,0x0000000100000000)
  to   space 512K, 0% used [0x00000000fff00000,0x00000000fff00000,0x00000000fff80000)
 ParOldGen       total 13312K, used 2192K [0x00000000fec00000, 0x00000000ff900000, 0x00000000ff900000)
                                                 object space 13312K, 16% used [0x00000000fec00000,0x00000000fee24030,0x00000000ff900000)
 Metaspace       used 2874K, capacity 4486K, committed 4864K, reserved 1056768K
  class space    used 308K, capacity 386K, committed 512K, reserved 1048576K
```

### 四、日志分析

1、进行了两次垃圾回收，堆内存第一次回收掉3.7M， 第二次回收掉4.2M。第一次回收时，年轻代空间从占用5.2M到占用500K，少了4.7M，多于堆内存整体回收的3.7M，说明一些对象被放入到老年代了，并没有被回收。

2、对象基本不进入survivor区，因为太小了，而每个对象都要占用1M的空间。