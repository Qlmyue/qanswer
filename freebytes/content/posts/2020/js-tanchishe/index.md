---
title: "用面向对象的思想开发js小游戏：贪吃蛇"
slug: js-tanchishe
date: 2020-06-14 08:29:01
category: 前端
tags: [前端, 前端]
summary: "最近用js写了个PC端的古老小游戏——贪吃蛇，不为别的，只是纯粹地想体验一下用面向对象编写js代码的感觉。"
status: published
views: 1724
---

随着前端的发展，js在编码风格领域，也早有了另一番新气象，ES6新增的class关键字，企图为js打造出面向对象的编程风格，另外，各种JavaScript设计模式，也是在将js往面向对象的领域发展。

但是，不得不说，如果将JavaScript作为一种编程语言来使用，是十分牵强的，其自身的弱语言属性，十分不严谨的代码风格，决定了太多的东西。所以它的面向对象，其实也比较勉强，大多数情况只是一种语法糖。 其实现在市场上的很多前端人员，尚且不具备面向对象的编码思想， 

不过，用面向对象的思想去写js，依然是一件比较有趣的事情。

最近用js写了个PC端的古老小游戏——[贪吃蛇]()，完全使用面向对象的思想，并尽量地将页面渲染代码与业务逻辑代码分离。不为别的，只是纯粹地想体验一下用面向对象编写js代码的感觉。结果嘛，就是觉得，用这种编码风格，可以很大程度上的增加js代码的可阅读性与严谨性以及拓展性。

下面展示下代码的冰山一角：

```
window.onload = function () {
    // 初始化容器
    containerEl = document.getElementById("container");
    containerWidth = containerEl.offsetWidth - 2;// 减去border边界宽度值2px
    containerHeight = containerEl.offsetHeight - 2;
    container = new Container(containerWidth, containerHeight, containerEl.offsetLeft, containerEl.offsetTop, null, containerEl);
    // 初始化食物对象
    produceFood(container);
    // 初始化蛇对象
    var snake = initSnake();
    // 键盘移动蛇对象
    moveSnake(snake);
}

```

```
// 方块对象，蛇和食物都是由方块组成
function Blocker(id, width, height, bgColor, left, top, borderRadius, invalid) {
    // 公有属性
    this.id = id;
    this.width = width;
    this.height = height;
    this.bgColor = bgColor;
    //当前横坐标
    this.left = left;
    // 当前纵坐标
    this.top = top;
    this.invalid = invalid;
    this.position = 'absolute';
    this.borderRadius = borderRadius;
    this.el = null;
    // 移动前的横坐标
    this.previousLeft = null;
    // 移动前的纵坐标
    this.previousTop = null;
    // 前一个节点对象
    this.previousBloker = null;
}

// 静态属性，必须在外部声明
Blocker.size = 20;

Blocker.prototype = {
    constructor: Blocker,
    //对象转化为DOM节点
    toEl: function () {
        var el = document.createElement('div');
        // this.el = el;
        el.id = this.id;
        el.style.backgroundColor = this.bgColor;
        el.style.width = this.width + 'px';
        el.style.height = this.height + 'px';
        el.style.left = this.left + 'px';
        el.style.top = this.top + 'px';
        el.style.position = this.position;
        el.style.borderRadius = this.borderRadius;
        return el;
    },
}
```

游戏链接： [https://www.freebytes.net/game/tanchishe.html]()