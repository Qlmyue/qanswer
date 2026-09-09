---
title: "根据JVM日志计算JVM参数"
slug: jvm-log-params
date: 2020-06-24 06:35:26
category: java
tags: [java, java, jvm, 精品]
summary: "本文讲解如何根据程序运行时输出的jvm日志，计算出最有可能的jvm设置参数。"
status: published
views: 1510
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

### 二、程序运行日志

```
[GC (Allocation Failure) [PSYoungGen: 5397K->504K(6656K)] 5397K->1704K(26112K), 0.0024791 secs] [Times: user=0.00 sys=0.01, real=0.00 secs] 
[GC (Allocation Failure) [PSYoungGen: 5742K->488K(6656K)] 6942K->2760K(26112K), 0.0007407 secs] [Times: user=0.00 sys=0.00, real=0.00 secs] 
Heap
 PSYoungGen      total 6656K, used 1573K [0x00000000ff900000, 0x0000000100000000, 0x0000000100000000)
  eden space 6144K, 17% used [0x00000000ff900000,0x00000000ffa0f748,0x00000000fff00000)
  from space 512K, 95% used [0x00000000fff80000,0x00000000ffffa020,0x0000000100000000)
  to   space 512K, 0% used [0x00000000fff00000,0x00000000fff00000,0x00000000fff80000)
 ParOldGen       total 19456K, used 2272K [0x00000000fd800000, 0x00000000feb00000, 0x00000000ff900000)
  object space 19456K, 11% used [0x00000000fd800000,0x00000000fda38030,0x00000000feb00000)
 Metaspace       used 2879K, capacity 4486K, committed 4864K, reserved 1056768K
  class space    used 308K, capacity 386K, committed 512K, reserved 1048576K
```

### 三、计算参数

1、根据 PSYoungGen   total 6656K，知道新生代的大概大小是7M。

2、ParOldGen   total 19456K, used 2272K [0x00000000fd800000, 0x00000000feb00000, 0x00000000ff900000)    可根据这条记录计算老年代的大小。

使用十六进制计算差值（ 0x00000000feb00000 -  0x00000000fd800000 ）=FD80 0000‬，再将结果转为十进制4253024256‬，然后 4253024256‬ /1024/1024=19M。

那么老年代加上年轻代的空间值，也就是堆空间内存就是26M，但这只是-Xms的对应值，还要计算-Xmx。

同理，将（ 0x00000000ff900000 - 0x00000000fd800000 ）转10进制等于34603008， 34603008 /1024/1024=33M。

那么就能得出-Xmx的值是33+7=40M了。

如此可推论，最有可能的jvm参数应该是——

> 

-Xms26m -Xmx40m -Xmn7m -XX:+PrintGCDetails 

实际上的 -Xms参数是25m，但是这没有关系，因为除法运算会导致计算结果准确度下降，这样的偏差是允许的。