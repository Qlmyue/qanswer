---
title: "JVM日志分析之一"
slug: jvm-log-anaylise-1
date: 2020-06-23 09:25:09
category: java
tags: [java, java, jvm]
summary: "本文主要介绍对程序运行时打印的jvm日志进行的详细解析（一）。"
status: published
views: 1508
---

1、程序Test1

```
public class Test1 {
    public static void main(String[] args) {
        byte[] b =null;
        for (int i = 0; i < 10; i++) {
            b=new byte[1*1024*1024];
        }
    }
}
```

2、设置JVM参数

jvm参数 :  -Xmx20m -Xms20m -Xmn1m -XX:+PrintGCDetails
意思：设置堆内存最大最小值为20M，新生代内存为1M，打印详细的堆参数

3、程序运行结果

```
[GC (Allocation Failure) [PSYoungGen: 511K->504K(1024K)] 511K->504K(19968K), 0.0024389 secs] [Times: user=0.00 sys=0.00, real=0.00 secs] 
Heap
 PSYoungGen      total 1024K, used 962K [0x00000000ffe80000, 0x0000000100000000, 0x0000000100000000)
  eden space 512K, 89% used [0x00000000ffe80000,0x00000000ffef2878,0x00000000fff00000)
  from space 512K, 98% used [0x00000000fff00000,0x00000000fff7e030,0x00000000fff80000)
  to   space 512K, 0% used [0x00000000fff80000,0x00000000fff80000,0x0000000100000000)
 ParOldGen       total 18944K, used 10240K [0x00000000fec00000, 0x00000000ffe80000, 0x00000000ffe80000)
  object space 18944K, 54% used [0x00000000fec00000,0x00000000ff6000a0,0x00000000ffe80000)
 Metaspace       used 2873K, capacity 4486K, committed 4864K, reserved 1056768K
  class space    used 308K, capacity 386K, committed 512K, reserved 1048576K
```

4、结果解释

4.1      Allocation Failure 表明本次引起GC的原因是因为在年轻代中没有足够的空间能够存储新的数据了。

4.2      **[PSYoungGen: 511K->504K(1024K)]  **其中PS是指Parallel Scavenge 垃圾收集器，YongGen是指新生代。回收前新生代内存占用511K，回收后占用504K，新生代总内存1024K。

4.3      511K->504K(19968K)  堆内存在gc前占用511K，gc后占用504K，总大小19968K

4.4      0.0024389 secs 表示gc耗时

4.5      PSYoungGen      total 1024K, used 962K [0x00000000ffe80000, 0x0000000100000000, 0x0000000100000000)
这里表示年轻代一共1m，已经使用了962K； 后面三个16进制的数字，其实是对新生代内存空间的地址编码。从左到右依次表示，内存空间的开始地址、内存地址空间的最小结束地址、内存空间的最大结束地址。给定两个结束地址，主要是为了让内存空间大小变得可调节，为类似-Xmx100m -Xms20m这样的参数提供服务。 

4.6      ParOldGen       total 18944K, used 10240K  表示老年代使用了10M，也就是说程序分配的byte数组对象都直接分到了老年代，因为新生代只有1M，不足以接受每次分配的对象。