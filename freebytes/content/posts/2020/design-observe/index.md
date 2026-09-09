---
title: "设计模式之观察者模式"
slug: design-observe
date: 2020-07-01 12:10:03
category: java
tags: [java, java, 设计模式]
summary: "观察者模式主要分为两个主体：观察者和通知者，在某些行为触发时，通知者将会通知观察者。观察者需要将自己的对象交给通知者，以便通知者能够调用观察者的方法，进行通知行为。"
status: published
views: 1498
---

### 观察者模式

观察者模式经常被用于监督进度条等场景，其特点如下：

1、观察者模式主要分为两个主体：观察者和通知者，在某些行为触发时，通知者将会通知观察者。

2、观察者需要将自己的对象交给通知者，以便通知者能够调用观察者的方法，进行通知行为。

3、观察者和通知者是多对一的关系。

4、这种模式的缺点在于，当其中一个观察者的方法执行阻塞 ，会影响后通知者对后续观察者的通知。

### 案例

场景：两个同事在上班时间开小差，一个同事把风，随后老板突然来了，把风的同事赶紧通知开小差的同事，收到通知的同事赶紧停止开小差。

启动类——

```
public class App {

    public static void main(String[] args) throws InterruptedException {
        //构建两个观察者  嘉冰和亚文  实现Observer
        Lijiabing jiabing = new Lijiabing();
        Liuyawen yawen = new Liuyawen();

        jiabing.watchTV();
        yawen.game();

        //构建一个通知者 小莹
        Noticer bixiaoying = new Bixiaoying();

        bixiaoying.addObserver(jiabing);
        bixiaoying.addObserver(yawen);

        Thread.sleep(1000);

        //构建一个触发行为
        System.out.println("陈老板来了");
        bixiaoying.notifyAllObserver();
    }
}
```

通知者——

```
public interface Noticer {
    //添加观察者
    void addObserver(Observer jiabing);
    //通知观察者
    void notifyAllObserver();
}

//通知者实现类
public class Bixiaoying implements Noticer {
    List<Observer> observers = new ArrayList<>(10);

    @Override
    public void addObserver(Observer observer) {
        observers.add(observer);
    }

    @Override
    public void notifyAllObserver() {
        observers.forEach(new MyConsumer());
    }

    private class MyConsumer implements Consumer<Observer> {
        @Override
        public void accept(Observer observer) {
            observer.update(null, null);
        }
    }
}

```

观察者——

```
public interface Observer {
    //接收通知
    void update(Observable o, Object arg);
}

//观察者实现类
public class Liuyawen implements Observer {
    @Override
    public void update(Observable o, Object arg) {
        System.out.println("亚文关掉游戏");
    }
    void game(){
        System.out.println("亚文打游戏");
    }
}

//观察者实现类
public class Lijiabing implements Observer {
    @Override
    public void update(Observable o, Object arg) {
        System.out.println("嘉冰关掉直播");
    }
    void watchTV(){
        System.out.println("嘉冰看直播");
    }
}

```