---
title: "设计模式之装饰模式"
slug: design-decorator
date: 2020-07-01 12:29:58
category: java
tags: [java, java, 设计模式]
summary: "装饰模式（Decorator Pattern）是一种比较常见的模式，动态地给一个对象添加一些额外的职责。tomcat源码中RequestFacade就是对Request的装饰类。"
status: published
views: 1479
---

### 装饰模式

装饰模式（Decorator Pattern）是一种比较常见的模式，动态地给一个对象添加一些额外的职责。就增加功能来说，装饰模式相比生成子类更为灵活。

tomcat源码中RequestFacade就是对Request的装饰类。

### 案例

被装饰者

```
//被装饰者
public class Component1 {
    public void operation(){
        System.out.println("我是被装饰者");
    }
}

```

装饰者

```
public class Decorator1 extends Component1{
    private Component1 component1;

    public Decorator1(Component1 component1) {
        this.component1 = component1;
    }

    @Override
    public void operation(){
        System.out.println("我是装饰者-----");
    }

    public void eat(){
        System.out.println("-------我是装饰者,我要吃遍麦当劳-----");
    }

}

```

启动类

```
public class App1 {
    public static void main(String[] args) {
        new Component1().operation();
        new Decorator1(new Component1()).operation();
        new Decorator1(new Component1()).eat();
    }
}
```