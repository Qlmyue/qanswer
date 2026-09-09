---
title: "设计模式之适配器模式"
slug: design-adpter
date: 2020-07-03 02:38:38
category: java
tags: [java, java, 设计模式]
summary: "所谓适配器，其实就是在不得不调用某个底层接口规范, 但出于某些需要又必须声明自己专属的接口规范的时候，可以声明一个对象实现自己的接口、同时又调用到该底层接口， 该对象即是适配器。"
status: published
views: 1734
---

### 适配器模式

所谓适配器，其实就是在不得不调用某个底层接口规范, 但出于某些需要又必须声明自己专属的接口规范的时候，可以声明一个对象实现自己的接口、同时又调用到该底层接口， 该对象即是适配器。

适配器做了两个接口之间的转换工作， 提供自定义接口的同时又隐藏了实际的底层接口。

### 角色

适配者对象：Adptee
适配器对象：Adpter

### 应用场景

现在需要做一个实现遥控器设备关机的功能，朗格厂商和南艺厂商分别提供了不同的实现接口，如下：

```
class LongoAdptee {
    public void shutdownForLongo() {
        System.out.println("调用——朗格设备的关机功能");
    }
}

class NanyiAdptee  {
    public void shutdownForNanyi() {
        System.out.println("调用——南艺设备的关机功能");
    }
}
```

调用时方法如下：

```
        System.out.println("----实现适配器前的调用----");
        LongoAdptee longoAdptee = new LongoAdptee();
        longoAdptee.shutdownForLongo();

        NanyiAdptee nanyiAdptee = new NanyiAdptee();
        nanyiAdptee.shutdownForNanyi();
```

这个时候，由于业务的需要，你需要希望统一这两个适配者的接口规范，将shutdownForLongo()和shutdownForNanyi()都统一成shutdown()方法，使得外部只需调用shutdown()就能访问到朗格或者南艺的关机方法。

这个时候，你就需要自定义一个接口，定义关机的方法,这时候，然后声明两个适配器去实现这个自定义接口。如下：

```
/**
 * 自定义规范，统一关机方法
 */
interface ControllDevice {
    void shutdown();
}

/**
 * 适配器，适配朗格设备的关机方法
 */
class LongoAdpter implements ControllDevice {
    private LongoAdptee adptee;
    public LongoAdpter(LongoAdptee adptee) {
        this.adptee = adptee;
    }
    @Override
    public void shutdown() {
        adptee.shutdownForLongo();
    }
}

/**
 * 适配器，适配南艺设备的关机方法
 */
class NanyiAdpter implements ControllDevice {
    private NanyiAdptee adptee;
    public NanyiAdpter(NanyiAdptee adptee) {
        this.adptee = adptee;
    }
    @Override
    public void shutdown() {
        adptee.shutdownForNanyi();
    }
}
```

在实现了适配器后，调用关机方法的方式，就变成了这样——

```
        //实现适配器后的调用
        System.out.println("----实现适配器后的调用----");
        ControllDevice adpter = new LongoAdpter(new LongoAdptee());
        adpter.shutdown();
        adpter = new NanyiAdpter(new NanyiAdptee());
        adpter.shutdown();
```

如此，外部的接口调用也就统一了。

### 适配器实现方式改进，隐藏适配者

不过，上面这种实现适配器的方式不算完美，因为你在调用适配器的关机方法之前，得先传一个适配者对象参数进去：ControllDevice adpter = new LongoAdpter(new LongoAdptee());

这样其对于调用方来说，并没有真正的隐藏了底层实现（适配者）。想要做到隐藏适配者，就要换一种方式去写适配器类了，如下：

```
/**
 * 自定义规范，统一关机方法
 */
interface ControllDevice {
    void shutdown();
}

/**
 * 适配器，适配朗格设备的关机方法
 */
class LongoAdpter extends LongoAdptee implements ControllDevice {
    @Override
    public void shutdown() {
        super.shutdownForLongo();
    }
}

/**
 * 适配器，适配南艺设备的关机方法
 */
class NanyiAdpter extends NanyiAdptee implements ControllDevice {
    @Override
    public void shutdown() {
        super.shutdownForNanyi();
    }
}
```

通过适配器继承适配者的方式，子类（适配器）可直接调用父类（适配者）的底层实现，就省去了传入底层实现对象作为参数的步骤。在调用时，也真正的隐藏了底层实现——

```
        //实现适配器后的调用，隐藏适配者
        System.out.println("----实现适配器后的调用----");
        ControllDevice adpter = new LongoAdpter();
        adpter.shutdown();
        adpter = new NanyiAdpter();
        adpter.shutdown();
```

如此，大功告成。