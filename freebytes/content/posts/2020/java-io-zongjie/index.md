---
title: "javaIO学习总结篇"
slug: java-io-zongjie
date: 2020-01-15 07:41:12
category: java
tags: [IO, java, java]
summary: "本文对javaIO的描述不涉及NIO，仅讲述IO的设计架构、设计思想、部分源码、常用的API及某些重要的细节等。"
status: published
views: 1968
---

## 简介

本文对javaIO的描述不涉及NIO，仅讲述IO的设计架构、设计思想、部分源码、常用的API及某些重要的细节等。

## 基础知识

回顾一下相关的基础知识，是很有必要的。 

### bit：

位。位是电子计算机中最小的数据单位。每一位的状态只能是0或1。比尔盖茨曾经说过，计算机世界都是由0和1组成的。计算机也只能读懂0和1这种二进制数据。

### **byte**：

字节。8个二进制位构成1个"字节(Byte)"，它是存储空间的基本计量单位。即：1byte=8bit。

### 编码：

编码的知识量太大，这里只是简单提一下开发中常用到的utf-8编码。在utf-8编码中，一个英文字符等于一个字节，一个中文（含繁体）等于三个字节。无论是中文还是英文，都叫字符。中文标点占三个字节，英文标点占一个字节。也就是说一个“千”字，它要被计算机识别，首先转化成对应它的三个byte字节（对应规则在相关的映射表中），再转化成3*8=24（bit）。‭最终结果是11100101 10001101 10000011‬ ，这个二进制数字才能被计算机读懂。而英文字母“Q”的转化简单些，它只需要一个字节去表示 ‭10000001‬。

### 原码：

正数的源码是其二级制数，负数的原码是其符号位为1的二进制数。

> 

[+1]原 = 0000 0001 

[-1] 原 = 1000 0001

### 反码：

正数的反码是其本身，负数的反码是符号位不变其余位取反。

> 

[+1] = [00000001]原 = [00000001]反
[-1] =  [10000001]原 = [11111110]反

### 补码：

正数的补码就是其本身，负数的补码是其反码+1。

> 

[+1] = [00000001]原 = [00000001]反 = [00000001]补
[-1] =  [10000001]原 = [11111110]反 = [11111111]补

## IO的设计思想

一套程序，读取数据的功能和写入数据的功能往往是必不可少的。读取的数据可能来自于各种数据源，包括文件、控制台、网络链接等；而读取的方式，包括按字节读取、按字符读取、缓冲读取等；输出数据时亦然。

对于编写这么一套功能，我们需要解决的问题，抽象来说就是——以何种方式输入数据，以何种方式输出数据的问题。

IO 顾名思义，是input与output的意思，即是输入与输出。它实际上就是一套解决上述问题的方案。在上述问题中，涉及到了两个关键点：数据，何种方式。

在javaIO的实现中，用InputStream、OutputStream、Reader、Writer表示对何种方式的顶层抽象，有什么样的数据，它就用什么样的方式去处理输入输出。如是File数据，就用FileInputStream和FileOutputStream去输入输出；如是byte类型，就用ByteArrayInputStream和ByteArrayOutputStream输入输出...

## IO的设计架构

[

![](https://www.freebytes.net/wp-content/uploads/2020/01/image-1-647x1024.png)

]()

在javaIO中，根据对数据的不同处理方式，又细分出了字节流和字符流。
InputStream表示字节输入流，用OutputStream表示字节输出流。
用Reader表示字符输入流，用Writer表示字符输出流。

而“流”本身又被定义了两层概念，分为节点流和处理流，节点流是指与数据源直接相连的流，处理流是指与节点流相连间接控制数据源的流，处理流大体上是节点流的上层封装，对节点流的数据做一些处理（例如缓冲处理、过滤处理），IO使用装饰器模式实现这种关系。

### 装饰器模式

装饰模式是在不必改变原类文件和使用继承的情况下，动态的扩展一个对象的功能。它是通过创建一个包装对象，也就是装饰来包裹真实的对象。

```
new BufferedInputStream(new FileInputStream(file));
```

这样一段代码，表示使用BufferedInputStream处理流，装饰FileInputStream节点流，而BufferedInputStream也具备了同FileInputStream的部分核心方法：read(),available(),close()等。这些方法会比FileInputStream原来对应的方法更加强大。

## 深入源码

### 1. 字节流顶层抽象 InputStream、OutputStream

InputStream和OutputStream是IO字节流的顶层抽象类之一， InputStream的核心api如下：

```
//读取输入流中的下一个字节，并返回它
public abstract int read() throws IOException

//指定偏移量和长度，批量读取字节，并返回已读取的数目
public int read(byte b[], int off, int len) throws IOException

//在无阻塞的情况下，返回输入流中剩余的可读取的字节总数，但是并不保证一定精确， 
//主要取决于实现类
public int available() throws IOException

//关闭流，释放系统资源
public void close() throws IOException {}

//标记在读取输入流时，读到的内存空间的位置，参数是标记之后，可被读取的最大字节 
//数
public synchronized void mark(int readlimit) {}

//恢复到标记的位置，重新从标记位置起读取输入流的数据
public synchronized void reset() throws IOException 
```

 OutputStream的核心api如下： 

```
//写一个特定的字节到输出流中，这个字节虽然是32位的整数，但是只有低8位能被写 
//入，高24位会被忽略。
public abstract void write(int b) throws IOException

//批量写入字节
public void write(byte b[]) throws IOException

//强制所有缓冲字节被输出
public void flush() throws IOException

//关闭流，释放系统资源
public void close() throws IOException
```

可以看到，read()方法返回的是int类型的数据，但其实返回的只是一个字节，只有8位数据，按理说没必要用一个32位的int变量接收。这是为什么呢？

#### 为什么流的read()方法一般都是返回int类型的数据，而不是byte类型数据？

首先，read方法大多是c++的本地方法，由它返回的数据是unsigned byte类型 ，范围是【0,255】，这个范围已经超出了byte能表示的范围，byte的范围是【-128,127】。

针对这个问题，可以设想使用强转的方式去解决，即是：将unsigned byte强转为byte，那么超出的部分【 128，255 】就会用byte的负数部分【-128，-1】来表示。如 ：（byte）128=-128 ， （byte）129=-127，...   （byte）255=-1。

可以看到， 使用强转的方式， unsigned byte 类型的255将被byte类型的-1表示，但是-1是用来表示流结束符的，所以这种使用强转的方法明显不能用来解决问题。

强转不行，那就向上转型，用int去接收 【0,255】。int数据的范围很大，接收完全没有问题。但是这又会引发另一个问题—— jvm做byte向int转型处理时，会根据符号位补全高位。如：

byte类型的数据10，其补码是：00001010，符号位是0，向上转型为int时补全高位，则变成 00000000，00000000，00000000，00001010。跟原来的补码一致，没有问题。但是有负数的情况——

byte类型的数据-10，其补码是：11110110，符号位是1，向上转型为int时补全高位，则变成 11111111，11111111 ，11111111 ，11110110 。跟原来的补码不一致，有问题！ 

计算机底层是使用补码来存储数据的，因此需要保证数据的补码在转型前后的一致性。上面的10和-10的补码，其实在低8位是完全相同的，不同的只是高24位。  为此，只要将高24位全部换成0，就可以实现补码的一致性。所以inputstream的实现类的read方法，在将读取到的字节值返回时，一般都会写一段“& 0xff”的代码，表示将该值和11111111进行与运算，即可将高24位全部变成0，如：

```
    //ByteArrayInputStream
    public synchronized int read() {
        return (pos < count) ? (buf[pos++] & 0xff) : -1;
    }

    //BufferedInputStream
    public synchronized int read() throws IOException {
        if (pos >= count) {
            fill();
            if (pos >= count)
                return -1;
        }
        return getBufIfOpen()[pos++] & 0xff;
    }
```

### 2. 最基本的节点流ByteArrayInputStream、ByteArrayOutputStream

这两个实现类分别继承了InputStream和OutputStream，主要是用于处理内存中的字节数组。 它们各自维护一个byte数组——

```
 protected byte buf[];
```

ByteArrayInputStream初始化时，将byte数组赋予buf []，使用read()方法读取数据时，会依次返回每个元素的值。

[

![](https://www.freebytes.net/wp-content/uploads/2020/01/image-2-300x138.png)

]()

ByteArrayInputStream 的read方法——

```
public synchronized int read() {    
     return (pos < count) ? (buf[pos++] & 0xff) : -1;
 }
```

ByteArrayInputStream的基本使用——

```
public void testByteArrayInputStream()throws IOException{
    byte[] buf = new byte[]{1,2};
    ByteArrayInputStream inputStream = new ByteArrayInputStream(buf);
    int b = inputStream.read();
    System.out.println(b);        //1
    int b1 = inputStream.read();
    System.out.println(b1);       //2
}
```

ByteArrayOutputStream的write方法——

```
public void write(int b) {
    this.ensureCapacity(1);
    this.buf[this.count] = (byte)b;
    ++this.count;
}
//实际上只是将数据b写入到buf数组中。
```

 ByteArrayOutputStream的基本使用—— 

```
 public void testByteArrayOutputStream() throws IOException{
        byte[] buf = "渣男".getBytes("utf-8");
        //初始化一个长度为5的byte数组，用于存储写入的数据。
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream(5);
        for (byte b : buf) {
            byteArrayOutputStream.write(b);
        }
        String s = byteArrayOutputStream.toString("utf-8");
        System.out.println(s);  //渣男
  }
```

###  3. 文件节点流 FileInputStream、FileOutputStream 

这是专门处理文件数据的两个节点流，维护一个文件对象。其读取文件的方法有两种，按字节读取和批量读取。基本使用如下——

```
public static File *file *= new File("F:\\FFOutput\\我为自己而战.mp4");

//按字节读取
@org.junit.Test
public void testRead() throws IOException {
    FileInputStream inputStream = new FileInputStream(*file*);
    long begin = System.*currentTimeMillis*();
    int read = inputStream.read();
    while (read != -1) {
        read = inputStream.read();
    }
    System.*out*.println("总输入时间==" + (System.*currentTimeMillis*() - begin));
    //总输入时间==51469
    inputStream.close();
}

//批量读取
@org.junit.Test
public void testReadBath() throws IOException {
    FileInputStream inputStream = new FileInputStream(*file*);
    long begin = System.*currentTimeMillis*();
    byte[] buf = new byte[8192];
    int read = inputStream.read(buf);
    while (read != -1) {
        read = inputStream.read(buf);
    }
    System.*out*.println("总输入时间==" + (System.*currentTimeMillis*() - begin));
    //总输入时间==20
    inputStream.close();
}
```

可以看到，批量读取文件会比按字节读取更加快速。

### 4. 缓冲处理流 BufferInputStream、BufferOutputStream

BufferInputStream和BufferOutputStream可以说是封装了一个节点流的处理流。它主要维护了一个缓冲区和一个inputStream节点流，使得在读取数据或写入数据时，经过一层缓冲的处理，以提升读取效率。相比FileInputStream的批量读取来说，他很好的维护了缓冲区，还兼顾了标记重置功能。

BufferInputStream的构造器——

```
public BufferedInputStream(InputStream in, int size) {
    super(in);
    if (size <= 0) {
        throw new IllegalArgumentException("Buffer size <= 0");
    }
    buf = new byte[size];
}
```

这里就说明，初始化对象时，需要传入一个InputStream，这个InputStream一般都是节点流，当然也可以是处理流。同时它会初始化一个byte数组，作为缓冲区。

通过read()方法源码读懂缓冲逻辑——

```
public synchronized int read() throws IOException {
    if (pos >= count) {
        //如果缓冲区数据已经读完，就从InputStream中读取数据，将数据填充到缓冲区
        fill();
        if (pos >= count)
          //数据已经全部读完，那么就返回结束符-1
            return -1;
    }
    //返回缓冲池的数据
    return getBufIfOpen()[pos++] & 0xff;
}

//获取缓冲池
private byte[] getBufIfOpen() throws IOException {
    byte[] buffer = buf;
    if (buffer == null)
        throw new IOException("Stream closed");
    return buffer;
}

//将从inputstream读取到的数据填充入缓冲区。
private void fill() throws IOException {
    byte[] buffer = getBufIfOpen();
    if (markpos < 0)
        pos = 0;            /* no mark: throw away the buffer */
    else if (pos >= buffer.length)  /* no room left in buffer */
        if (markpos > 0) {  /* can throw away early part of the buffer */
            int sz = pos - markpos;
            System.*arraycopy*(buffer, markpos, buffer, 0, sz);
            pos = sz;
            markpos = 0;
        } else if (buffer.length >= marklimit) {
            markpos = -1;   /* buffer got too big, invalidate mark */
            pos = 0;        /* drop buffer contents */
        } else if (buffer.length >= *MAX_BUFFER_SIZE*) {
            throw new OutOfMemoryError("Required array size too large");
        } else {            /* grow buffer */
            int nsz = (pos <= *MAX_BUFFER_SIZE *- pos) ?
                    pos * 2 : *MAX_BUFFER_SIZE*;
            if (nsz > marklimit)
                nsz = marklimit;
            byte nbuf[] = new byte[nsz];
            System.*arraycopy*(buffer, 0, nbuf, 0, pos);
            if (!*bufUpdater*.compareAndSet(this, buffer, nbuf)) {
                // Can't replace buf if there was an async close.
                // Note: This would need to be changed if fill()
                // is ever made accessible to multiple threads.
                // But for now, the only way CAS can fail is via close.
                // assert buf == null;
                throw new IOException("Stream closed");
            }
            buffer = nbuf;
        }
    count = pos;

   //这一句比较重要，意思是调用inputstream的批量读取方法，读取到buffer缓冲区中
    int n = getInIfOpen().read(buffer, pos, buffer.length - pos);
    if (n > 0)
        count = n + pos;
}
```

这里仔细说一下，BufferInputStream对缓冲区的处理，已知缓冲区的大小是有初始值的，初始为8192字节。BufferInputstream在读取数据时，首先调用传入的inputstream的read方法的，将数据批量读取到缓冲区中，再直接返回缓冲区中的数据给调用者。但是当数据远不止8192字节时，这个缓冲区又该怎么办呢？

这里采取的方案是，重复利用缓冲区+扩容的方式来处理的。可以将缓冲区看做是一个队列，队列的初始大小为8192。假设队列已被填满，程序已经读到队列的最后一个值，那么就可以将流中的数据覆写到队列前面的位置，因为前面的值已经被读取过了，没有意义继续存储着。

[

![](https://www.freebytes.net/wp-content/uploads/2020/01/image-3.png)

]()

这就是缓冲区的重复利用，本质上就是对循环队列的应用。那在什么时候会使用到扩容呢？

bufferInputStream有方法mark()、reset()，意在标记读取到缓冲区中的哪一个位置，在调用mark方法标记完之后，继续读取数据，然后可以调用reset方法复位，将队列游标重新指向mark标记过的位置，继续从这个位置开始读取。

```
public synchronized void mark(int readlimit) {
    marklimit = readlimit;
    markpos = pos;
}
public synchronized void reset() throws IOException {
    getBufIfOpen(); // Cause exception if closed
    if (markpos < 0)
        throw new IOException("Resetting to invalid mark");
    pos = markpos;
}
```

正是因为有这个功能的存在，使得BufferInputStream对缓冲区的维护变得复杂了许多，简单的循环队列应用也变得麻烦起来。

它会造成一个问题，那就是已标记过的位置的数据，是不能被覆写的，因为还需要复位。这种情况下循环队列的方案就不可用了。但是这种情况也不是经常发生，所以BufferInputStream应对这种情况的解决方案并不考虑性能问题，简单而粗暴——扩容。

[

![](https://www.freebytes.net/wp-content/uploads/2020/01/image-4.png)

]()

至于BufferOutputStream，原理是一样的，只不过操作相反，它是在写入数据时先将数据写入缓冲区，再批量将缓冲区数据写入到流中。

### 5. 随机访问文件类 RandomAccessFile

要访问一个文件的时候，不想把文件从头读到尾，而是希望像访问一个数据库一样地访问一个文本文件，使用RandomAccessFile类是最佳选择。常用于断点续传、分段下载。基本使用如下——

```
    public static File file = new File("D:\\random.txt");

    /**
     * 用于断点续传、分段下载
     * @throws IOException
     */
    @Test
    public void testSeek() throws IOException {
        //文件中数据为 0123456789
        RandomAccessFile randomAccessFile = new RandomAccessFile(file,"rw");
        //跳过三个字节
        randomAccessFile.skipBytes(3);
        //读取第四个字节
        int read = randomAccessFile.read();
        System.out.println((char) read);    //   3
        //回到第一个字节
        randomAccessFile.seek(0);
        System.out.println((char)randomAccessFile.readByte());  // 0
    }
```

### 6. 字符节点流 Reader

对于字符流，这里并不想多说，因为对字符的处理，归根到底还是对字节的处理。有些字符是由1个字节组成，有些是两个，有些是三个，具体依照编码规则而定。所以字符流的实现类，通常会维护一个编码或者解码对象或者做一些编解码的工作。字符流读取到的数据其实开始也是字节数据，只是通过解码操作来解码成字符，再返回给调用方。