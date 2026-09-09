---
title: "通过管道进行线程间通信"
slug: pipe-communicate
date: 2020-07-15 08:15:09
category: java
tags: [java, java, 并发]
summary: "管道流（pipeStream）是一种特殊的流，用于在不同线程间直接传送数据。一个线程发送数据到输出管道，另一个线程从输入管道中读数据。"
status: published
views: 1541
---

管道流（pipeStream）是一种特殊的流，用于在不同线程间直接传送数据。一个线程发送数据到输出管道，另一个线程从输入管道中读数据。通过管道，实现不同线程间的通信，而无须借助类似共享变量、临时文件之类的东西。

在java的JDK中提供了4个类来使线程间可以进行通信：

```
管道字节流   PipedInputStream，PipedOutputStream 
管道字符流   PipedReader，PipedWriter
```

### 案例

应用场景：1个线程负责写数据，1个线程负责接收数据。

写入线程：

```
class ThreadOut extends Thread {
    PipedOutputStream out;

    public ThreadOut(PipedOutputStream out) {
        this.out = out;
    }

    @Override
    public void run() {
        System.out.println("write:");
        try {
            String message = "hello world! You will be destoryed";
            out.write(message.getBytes());
            System.out.println("写入数据------" + message);
            out.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

```

接收线程：

```
class ThreadRead extends Thread {
    PipedInputStream input;

    public ThreadRead(PipedInputStream input) {
        this.input = input;
    }

    @Override
    public void run() {
        System.out.println("read:");
        try {
            byte[] buffer = new byte[10];
            int i = -1;
            while ((i=(input.read(buffer))) != -1) {
                System.out.println("读取数据----"+new String(buffer,0,i));
            }
            input.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

启动类：

```
public class TestPipe {
    public static void main(String[] args) throws IOException {
        PipedInputStream inputStream = new PipedInputStream();
        PipedOutputStream outputStream = new PipedOutputStream();
        inputStream.connect(outputStream);
        ThreadOut threadOut = new ThreadOut(outputStream);
        ThreadRead threadRead = new ThreadRead(inputStream);
        threadOut.start();
        threadRead.start();
    }
}
```