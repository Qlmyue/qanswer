---
title: "JVM日志分析之四"
slug: jvm-log-anaylise-4
date: 2020-06-24 03:26:08
category: java
tags: [java, java, jvm]
summary: "本文主要介绍对程序运行时打印的jvm日志进行的详细解析（四）。"
status: published
views: 1481
---

### 一、程序

```
public class Test4 {
    public static void main(String[] args) {
        byte[] b =null;
        for (int i = 0; i < 10; i++) {
            b=new byte[1*1024*1024];
        }
    }
}
```

### 二、JVM参数

jvm参数 :  -Xmx20m -Xms20m -Xmn7m -XX:+PrintGCDetails  -XX:SurvivorRatio=2

设置堆内存最大最小值为20M，新生代内存为7M，eden与幸存区的比率为2:1:1    打印详细的堆参数

### 三、程序运行日志

```
[GC (Allocation Failure) [PSYoungGen: 3186K->1528K(5632K)] 3186K->1648K(18944K), 0.0008831 secs] [Times: user=0.00 sys=0.00, real=0.00 secs] 
[GC (Allocation Failure) [PSYoungGen: 4678K->1512K(5632K)] 4798K->1648K(18944K), 0.0007746 secs] [Times: user=0.00 sys=0.00, real=0.00 secs] 
[GC (Allocation Failure) [PSYoungGen: 4654K->1528K(5632K)] 4790K->1688K(18944K), 0.0004853 secs] [Times: user=0.00 sys=0.00, real=0.00 secs] 
Heap
 PSYoungGen      total 5632K, used 3731K [0x00000000ff900000, 0x0000000100000000, 0x0000000100000000)
  eden space 4096K, 53% used [0x00000000ff900000,0x00000000ffb26f98,0x00000000ffd00000)
  from space 1536K, 99% used [0x00000000ffd00000,0x00000000ffe7e040,0x00000000ffe80000)
  to   space 1536K, 0% used [0x00000000ffe80000,0x00000000ffe80000,0x0000000100000000)
 ParOldGen       total 13312K, used 160K [0x00000000fec00000, 0x00000000ff900000, 0x00000000ff900000)
  object space  , 1% used [0x00000000fec00000,0x00000000fec28000,0x00000000ff900000)
 Metaspace       used 2874K, capacity 4486K, committed 4864K, reserved 1056768K
  class space    used 308K, capacity 386K, committed 512K, reserved 1048576K
```

### 四、日志分析

1、触发了三次垃圾回收，对象会进入幸存区，因为空间足够，老年代基本用不到

2、发生的gc次数太多，会影响系统性能，因此需要调整。