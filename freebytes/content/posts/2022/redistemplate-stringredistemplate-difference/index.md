---
title: "RedisTemplate和StringRedisTemplate的区别和关系"
slug: redistemplate-stringredistemplate-difference
date: 2022-03-29 08:25:49
category: java
tags: [java, java, redis]
status: published
views: 1865
---

RedisTemplate和StringRedisTemplate是我们项目中常用的redis操作类。他们的关系如下图所示：

[

![](https://www.freebytes.net/wp-content/uploads/2022/03/image-2.png)

]()

### StringRedisTemplate 

StringRedisTemplate是直接继承于 RedisTemplate 的，但是它同时限定了泛型的类型，并定义了自己的序列化器。

```
//<String, String>, 限定了只能操作key和value都是string类型的数据
public class StringRedisTemplate extends RedisTemplate<String, String> {
       //构造方法中，定义序列化器stringSerializer 
	public StringRedisTemplate() {
		RedisSerializer<String> stringSerializer = new StringRedisSerializer();
		setKeySerializer(stringSerializer);
		setValueSerializer(stringSerializer);
		setHashKeySerializer(stringSerializer);
		setHashValueSerializer(stringSerializer);
	}
    ......
}
```

由于限定了泛型，所以stringRedisTemplate操作的key和value都只能是string类型的，如下图：

[

![](https://www.freebytes.net/wp-content/uploads/2022/03/image-3.png)

]()

而 RedisTemplate 本身，是可以操作任意对象的存储和获取。

再看stringRedisTemplate本身在构造方法中定义的序列化器StringRedisSerializer， 序列化器的作用，是在redis存储键值对时，提供序列化的功能，在获取键值对时，提供反序列化的功能。深入StringRedisSerializer，可以看到它的关键API：

```
//反序列化
@Override
public String deserialize(@Nullable byte[] bytes) {
     return (bytes == null ? null : new String(bytes, charset));
}
//序列化
@Override
public byte[] serialize(@Nullable String string) {
     return (string == null ? null : string.getBytes(charset));
}
```

这里的序列化方式，是使用String本身的api：getBytes(Char c)将字符串序列化成了字节数组。而反序列化是用了String的构造方法，将字节数组反序列化成字符串对象。

```
RedisSerializer<String> stringSerializer = new StringRedisSerializer();
setKeySerializer(stringSerializer);
setValueSerializer(stringSerializer);
setHashKeySerializer(stringSerializer);
setHashValueSerializer(stringSerializer);
```

这里，setKeySerializer(stringSerializer)是将自己的序列化器，赋值给了父类 RedisTemplate的keySerializer对象，父类的几个重要对象如下：

```
private @Nullable RedisSerializer keySerializer = null;
private @Nullable RedisSerializer valueSerializer = null;
private @Nullable RedisSerializer hashKeySerializer = null;
private @Nullable RedisSerializer hashValueSerializer = null;
```

我们在使用api：stringRedisTemplate.opsForValue().get()或者set()的时候，使用的序列化器，就是这里的四个对象决定的，上面两个对应 opsForValue 操作，下面两个对应opsForHash操作。

### RedisTemplate  

再来看RedisTemplate本身，他在构造方法中没有设置序列化器，但是有一个关键方法要注意：  

```
@Override
public void afterPropertiesSet() {
    super.afterPropertiesSet();
    boolean defaultUsed = false;
    if (defaultSerializer == null) {
        defaultSerializer = new JdkSerializationRedisSerializer(
                classLoader != null ? classLoader : this.getClass().getClassLoader());
    }
    if (enableDefaultSerializer) {
        if (keySerializer == null) {
            keySerializer = defaultSerializer;
            defaultUsed = true;
        }
        if (valueSerializer == null) {
            valueSerializer = defaultSerializer;
            defaultUsed = true;
        }
        if (hashKeySerializer == null) {
            hashKeySerializer = defaultSerializer;
            defaultUsed = true;
        }
        if (hashValueSerializer == null) {
            hashValueSerializer = defaultSerializer;
            defaultUsed = true;
        }
    }
    if (enableDefaultSerializer && defaultUsed) {
        Assert.notNull(defaultSerializer, "default serializer null and not all serializers initialized");
    }
    if (scriptExecutor == null) {
        this.scriptExecutor = new DefaultScriptExecutor<>(this);
    }
    initialized = true;
}
```

afterPropertiesSet()是spring定义的接口方法，在bean对象初始化时执行。 RedisTemplate利用它，完成了序列化器的初始化。

可以看到，代码中，new了一个JdkSerializationRedisSerializer对象，作为默认的序列化器，它的构造方法如下：

```
public JdkSerializationRedisSerializer(ClassLoader classLoader) {
	this(new SerializingConverter(), new DeserializingConverter(classLoader));
}
```

SerializingConverter用于序列化，深入点进去看源码，会发现，它最终是调用了JDK中的IO源码ObjectOutputStream类的writeObject方法。同理，DeserializingConverter是用了ObjectInputStream类的readObject方法。因为都使用了jdk中的源码，所以这个序列化的名字才叫： JdkSerializationRedisSerializer。