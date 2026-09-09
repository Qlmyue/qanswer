---
title: "redis缓存与数据库保持一致"
slug: redis-db-same
date: 2020-10-14 03:13:58
category: java
tags: [java, java, redis, 精品]
summary: "使用redis缓存，通常会考虑到与数据库数据保持一致的问题。"
status: published
views: 7349
---

使用redis缓存，通常会考虑到与数据库数据保持一致的问题。

```
public void update(){
  updateCache();//更新缓存
  updateDb();//更新数据库
}
```

这段代码中，如果更新缓存失败了会抛出异常，那么数据库就不会被更新，缓存一致性得到保障。但是如果更新数据库失败了，redis缓存是不会回滚的，造成了不一致的问题。

```
@Transactional
public void update(){
  updateDb();//更新数据库
  updateCache();//更新缓存
}
```

这段代码稍微做了下改进，先更新数据库，再更新缓存，如果缓存更新报错，数据库会回滚，如果数据库更新报错，缓存也不会更新。似乎保持了缓存一致性。但，这只是从单线程操作的角度去看。

从多线程的角度去看，假设线程A和B同时访问update方法，A先执行了updateDb()，B后执行了updateDb()，但是B比A先执行了updateCache()，那么情况就是：A先更新了数据库，所以A的数据是旧数据，A却在最后将旧数据更新到缓存中，于是就出现了缓存脏数据。其实，缓存中的数据理应与B修改数据库的数据一致。如下图：

![](https://www.freebytes.net/wp-content/uploads/2020/10/image-1.png)

双向更新在多线程的情况下，无论如何都是会出现问题的，于是再将代码做一下改进——

```
@Transactional
public void update(){
  updateDb();//更新数据库
  deleteCache();//删除缓存
}
```

将更新缓存的操作改为删除缓存，这样子无论线程执行先后，最终反正都是删除缓存，并不会出现脏数据的情况。影响就是下次访问缓存的时候，缓存已失效，需要再次从数据库中加载到缓存。看起来，问题像是解决了。

但，忽视了另外一些场景，如——

```
@Transactional
public void update(){
  updateDb();//更新数据库
  deleteCache();//删除缓存
}

public T get(){
  if(getCache()!=null){
    //如果缓存不为空则返回缓存
    return getCache();
  }
  //如果缓存为空则加载数据库
  T t = loadFormDb();
  if(t!=null){
    //将数据库的值设置到缓存中
    setCahche(t);
  }
  return t;
}
```

假设在经历过一次update操作之后，缓存刚好被删了，这时候，A、B线程同时分别访问到了update和get方法，并执行如下顺序的代码：

- 1. B线程访问get方法，查询缓存为空，于是加载数据库，得到一个旧值b。
- 2. A线程访问update方法，更新数据库值为a，并将缓存删除。
- 3. B线程将旧值b设置到缓存中
- 4. 此时缓存的值为b，数据库的值为a，不一致。

当然这种情况的出现几率及其渺小，几乎可以不必考虑。但如果非要解决，那么可以采用“双删”的策略——

```
@Transactional
public void update(){
  deleteCache();//删除缓存
  updateDb();//更新数据库
  Thread.sleep(1000);//等待1秒
  deleteCache();//删除缓存
}
```

先延时，再做重复一次的删除。当然这个延时删除可以使用异步的方式，提高效率。这种延时双删，就能保证，读线程与写线程并发执行所造成的缓存脏数据，能够被清空。于是，保证了缓存一致性。

这种双删策略，其实大部分是这么写的——

```
@Transactional
public void update(){
  deleteCache();//删除缓存
  updateDb();//更新数据库
  //下面的代码最好使用异步执行
  Thread.sleep(1000);//等待1秒
  deleteCache();//删除缓存
}
```

结果也是一样的。