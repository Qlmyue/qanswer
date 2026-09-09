---
title: "JVM日志分析之五"
slug: jvm-log-anaylise-5
date: 2020-06-24 05:45:35
category: java
tags: [java, java, jvm]
summary: "本文主要介绍对程序运行时打印的jvm日志进行的详细解析（五）。"
status: published
views: 1626
---

### 一、程序

```
public class Test5 {
    public static void main(String[] args) {
        byte[] b =null;
        for (int i = 0; i < 10; i++) {
            b=new byte[1*1024*1024];
        }
    }
}
```

### 二、JVM参数

jvm参数 :  -Xmx20m -Xms20m -XX:NewRatio=1 -XX:+PrintHeapAtGC  -XX:SurvivorRatio=3      

设置堆内存最大最小值为20M，新生代与老年代内存比率为1:1，eden与幸存区的比率为3:1:1    打印GC前后的详细堆参数

### 三、程序运行日志

```
{Heap before GC invocations=1 (full 0):
 PSYoungGen      total 8192K, used 5381K [0x00000000ff600000, 0x0000000100000000, 0x0000000100000000)
  eden space 6144K, 87% used [0x00000000ff600000,0x00000000ffb41678,0x00000000ffc00000)
  from space 2048K, 0% used [0x00000000ffe00000,0x00000000ffe00000,0x0000000100000000)
  to   space 2048K, 0% used [0x00000000ffc00000,0x00000000ffc00000,0x00000000ffe00000)
 ParOldGen       total 10240K, used 0K [0x00000000fec00000, 0x00000000ff600000, 0x00000000ff600000)
  object space 10240K, 0% used [0x00000000fec00000,0x00000000fec00000,0x00000000ff600000)
 Metaspace       used 2867K, capacity 4486K, committed 4864K, reserved 1056768K
  class space    used 307K, capacity 386K, committed 512K, reserved 1048576K
Heap after GC invocations=1 (full 0):
 PSYoungGen      total 8192K, used 1688K [0x00000000ff600000, 0x0000000100000000, 0x0000000100000000)
  eden space 6144K, 0% used [0x00000000ff600000,0x00000000ff600000,0x00000000ffc00000)
  from space 2048K, 82% used [0x00000000ffc00000,0x00000000ffda6020,0x00000000ffe00000)
  to   space 2048K, 0% used [0x00000000ffe00000,0x00000000ffe00000,0x0000000100000000)
 ParOldGen       total 10240K, used 8K [0x00000000fec00000, 0x00000000ff600000, 0x00000000ff600000)
  object space 10240K, 0% used [0x00000000fec00000,0x00000000fec02000,0x00000000ff600000)
 Metaspace       used 2867K, capacity 4486K, committed 4864K, reserved 1056768K
  class space    used 307K, capacity 386K, committed 512K, reserved 1048576K
}
{Heap before GC invocations=2 (full 0):
 PSYoungGen      total 8192K, used 6926K [0x00000000ff600000, 0x0000000100000000, 0x0000000100000000)
  eden space 6144K, 85% used [0x00000000ff600000,0x00000000ffb1daf8,0x00000000ffc00000)
  from space 2048K, 82% used [0x00000000ffc00000,0x00000000ffda6020,0x00000000ffe00000)
  to   space 2048K, 0% used [0x00000000ffe00000,0x00000000ffe00000,0x0000000100000000)
 ParOldGen       total 10240K, used 8K [0x00000000fec00000, 0x00000000ff600000, 0x00000000ff600000)
  object space 10240K, 0% used [0x00000000fec00000,0x00000000fec02000,0x00000000ff600000)
 Metaspace       used 2867K, capacity 4486K, committed 4864K, reserved 1056768K
  class space    used 307K, capacity 386K, committed 512K, reserved 1048576K
Heap after GC invocations=2 (full 0):
 PSYoungGen      total 8192K, used 1736K [0x00000000ff600000, 0x0000000100000000, 0x0000000100000000)
  eden space 6144K, 0% used [0x00000000ff600000,0x00000000ff600000,0x00000000ffc00000)
  from space 2048K, 84% used [0x00000000ffe00000,0x00000000fffb2030,0x0000000100000000)
  to   space 2048K, 0% used [0x00000000ffc00000,0x00000000ffc00000,0x00000000ffe00000)
 ParOldGen       total 10240K, used 8K [0x00000000fec00000, 0x00000000ff600000, 0x00000000ff600000)
  object space 10240K, 0% used [0x00000000fec00000,0x00000000fec02000,0x00000000ff600000)
 Metaspace       used 2867K, capacity 4486K, committed 4864K, reserved 1056768K
  class space    used 307K, capacity 386K, committed 512K, reserved 1048576K
}

```

### 四、日志分析

1、Heap before GC invocations=1  表示第一次gc前的堆信息；
      Heap after GC invocations=1      表示第一次gc后的堆信息

2、数据表明，每次新生的对象都被放入eden区，当eden区内存将近临界值时，就会被gc回收；
第一次eden区达到5.3m时，被回收掉3.7M，剩余的1.6m被放入from区，因为from内存足够，所以不必放入老年代；
这个例子相比Test4，增大了新生代的内存，所以gc就少了一次。