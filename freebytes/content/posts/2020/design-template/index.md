---
title: "设计模式之模板方法模式"
slug: design-template
date: 2020-07-01 11:19:15
category: java
tags: [java, java, 设计模式]
summary: "模板方法模式是类的行为模式。准备一个抽象类，将部分逻辑以具体方法以及具体构造函数的形式实现，然后声明一些抽象方法来迫使子类实现剩余的逻辑。"
status: published
views: 1480
---

### 模板方法模式

模板方法模式是类的行为模式。准备一个抽象类，将部分逻辑以具体方法以及具体构造函数的形式实现，然后声明一些抽象方法来迫使子类实现剩余的逻辑。不同的子类可以以不同的方式实现这些抽象方法，从而对剩余的逻辑有不同的实现。这就是模板方法模式的用意。 

比如定义一个操作中的算法的骨架，将步骤延迟到子类中。模板方法使得子类能够不去改变一个算法的结构即可重定义算法的某些特定步骤。

### 模式中的角色

抽象类（AbstractClass）：实现了模板方法，定义了算法的骨架。
具体类（ConcreteClass)：实现抽象类中的抽象方法，已完成完整的算法。

### 案例

启动类

```
public class App {
    public static void main(String[] args) {
        AbstractClass studentClass = new StudentClass();
        AbstractClass teacherClass = new TeacherClass();
        studentClass.prepareGotoSchool();
        teacherClass.prepareGotoSchool();
    }
}
```

模板类

```
public abstract class AbstractClass {
    public final void prepareGotoSchool(){
        dressup();
        eatBreakfast();
        takeThings();
    }
    protected abstract void eatBreakfast();

    protected abstract void dressup();

    protected abstract void takeThings();
}
```

模板实现类1

```
public class StudentClass extends AbstractClass {
    @Override
    protected void eatBreakfast() {
        System.out.println("吃妈妈做的早饭");
    }

    @Override
    protected void dressup() {
        System.out.println("穿上学生服");
    }

    @Override
    protected void takeThings() {
        System.out.println("背上书包");
    }
}
```

 模板实现类2

```
public class TeacherClass extends AbstractClass {
    @Override
    protected void eatBreakfast() {
        System.out.println("和孩子一起吃早饭");
    }

    @Override
    protected void dressup() {
        System.out.println("穿上教师服");
    }

    @Override
    protected void takeThings() {
        System.out.println("带上考卷");
    }
}
```