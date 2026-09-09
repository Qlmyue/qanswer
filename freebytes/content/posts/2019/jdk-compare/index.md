---
title: "Java比较器之Comparable 和 Comparator"
slug: jdk-compare
date: 2019-08-14 03:43:19
category: java
tags: [java, java]
summary: "讲解jdk8的比较器：Comparable 和 Comparator"
status: published
views: 1727
---

## 前言

好久没写博客了，今天研究了一下jdk的比较器，想着随手写个博客吧。

# Comparable

首先介绍一下java.util.Comparable这个接口，该接口只有一个方法：

```
/** @param   o the object to be compared.
*   @return  a negative integer, zero, or a positive integer as this object
*            is less than, equal to, or greater than the specified object.
**/

public int compareTo(T o);

```

再简单的引文注释我也会翻译，这是原则问题。那么这里的意思就是，传入一个参数，进行比较，如果调用者比该参数“大”，那么返回正整数，反之返回负整数，相同则返回0。当然，这个”大”是由你自己去定义的。
在jdk8的源码中，很多类都实现了这个接口，如Date，Long，String，Integer等等。看看Date对这个接口的实现源码吧：

```
/**
      * Compares two Dates for ordering.
      *
      * @param   anotherDate   the Date to be compared.
      * @return  the value 0 if the argument Date is equal to
      *          this Date; a value less than 0 if this Date
      *          is before the Date argument; and a value greater than
      *      0 if this Date is after the Date argument.
      * @since   1.2
      * @exception NullPointerException if anotherDate is null.
      */
     public int compareTo(Date anotherDate) {
         long thisTime = getMillisOf(this);
         long anotherTime = getMillisOf(anotherDate);
         return (thisTime<anotherTime ? -1 : (thisTime==anotherTime ? 0 : 1));
     }
```

如果this的日期在传入参数的日期之前，那么返回负整数，反之返回正整数，相等返回0。这里是通过比较两个日期时间戳大小去实现的。
所以Comprable它就是一个很简单的比较器规范。

# Comparator

这个东西其实主要就是比较器的稍微高级应用。我看了源码并且做了下翻译，提取出了几个关键的方法。

```

    @FunctionalInterface
    public interface Comparator<T> {

        /**
         * 比较o1 o2 如果前者较大就返回正整数，反之返回负整数，相等则返回0
         */
        int compare(T o1, T o2);

        boolean equals(Object obj);

        /**
         * 返回一个把规则逆转的比较器   例：当前比较器指定的规则是按时间从小到大排序，那么它会返回一个按时间从大到小的比较器
         */
        default Comparator<T> reversed() {
            return Collections.reverseOrder(this);
        }

        /**
         * 在当前比较器的基础上拼接一个后续比较器。
         * 例如：
         * Comparator<String> cmp = Comparator.comparingInt(String::length)
         * .thenComparing(String.CASE_INSENSITIVE_ORDER);
         * 这是一个比较字符串的代码，意思是先比较字符串的长度，如果长度相等，就用String提供的比较器去比较。
         */
        default Comparator<T> thenComparing(Comparator<? super T> other) {
            Objects.requireNonNull(other);
            return (Comparator<T> & Serializable) (c1, c2) -> {
                int res = compare(c1, c2);
                return (res != 0) ? res : other.compare(c1, c2);
            };
        }

        //其实上个方法可以转换成以下形式，这样可能稍微接地气些。
        default Comparator<T> thenComparing_back(Comparator<? super T> other) {
            Objects.requireNonNull(other);
            Comparator<T> comparator = new Comparator<T>() {
                @Override
                public int compare(T o1, T o2) {
                    int res = this.compare(o1, o2);
                    if (res != 0) {
                        return res;
                    }
                    return other.compare(o1, o2);
                }
            };
            return comparator;
        }

        /**
         * 返回一个逆序规则
         */
        public static <T extends Comparable<? super T>> Comparator<T> reverseOrder() {
            return Collections.reverseOrder();
        }

        /**
         * 返回一个正常的排序规则
         */
        @SuppressWarnings("unchecked")
        public static <T extends Comparable<? super T>> Comparator<T> naturalOrder() {
            return (Comparator<T>) Comparators.NaturalOrderComparator.INSTANCE;
        }

        /**
         * 返回一个允许null存在的比较器，这个比较器认为null值比非null值小。如果两个比较值都是null，那么认定为相等。
         * 如果都不是null，那么按正常的逻辑比较。如果传入的比较器为null，那么认为所有非null值相等
         */
        public static <T> Comparator<T> nullsFirst(Comparator<? super T> comparator) {
            return new Comparators.NullComparator<>(true, comparator);
        }

        /**
         * 返回一个允许null存在的比较器，这个比较器认为null值比非null值大。如果两个比较值都是null，那么认定为相等。
         * 如果都不是null，那么按正常的逻辑比较。如果传入的比较器为null，那么认为所有非null值相等
         */
        public static <T> Comparator<T> nullsLast(Comparator<? super T> comparator) {
            return new Comparators.NullComparator<>(false, comparator);
        }

        /**
         * 传入处理器Function，返回一个新的比较器。
         * 这个新的比较器先使用function处理两个比较值key，再去比较key。
         */
        public static <T, U extends Comparable<? super U>> Comparator<T> comparing(
                Function<? super T, ? extends U> keyExtractor)
        {
            Objects.requireNonNull(keyExtractor);
            return (Comparator<T> & Serializable)
                    (c1, c2) -> keyExtractor.apply(c1).compareTo(keyExtractor.apply(c2));
        }

    }
```

# 应用场景

- List的排序

```
        List list = new ArrayList() {{
            add(4);
            add(444);
            add(3);
            add(2);
        }};
        //按升序排列
        list.sort(null);
        //按自然排序即升序排列
        list.sort(Comparator.naturalOrder());
        //按升序的逆序即降序排列，并且允许null值
        list.sort(Comparator.nullsLast(Comparator.naturalOrder()).reversed());
        //按升序的逆序即降序排列
        Collections.sort(list,Comparator.nullsLast(Comparator.naturalOrder()).reversed());
        System.out.println(Arrays.toString(list.toArray()));

```

- comparing方法

```
    public static <T, U extends Comparable<? super U>> Comparator<T> comparing(
            Function<? super T, ? extends U> keyExtractor)
    {
        Objects.requireNonNull(keyExtractor);
        return (Comparator<T> & Serializable)
            (c1, c2) -> keyExtractor.apply(c1).compareTo(keyExtractor.apply(c2));
    }

```

该方法是静态方法，传入一个function对象，规则是先用function处理两个比较参数key，再去比较这两个key。方法返回一个比较器，用于覆写比较逻辑。
comparing方法的简单应用：

```
        Function<Integer, Integer> f = s -> s * s;
        Comparator<Integer> comparator = Comparator.comparing(f);
        int compare = comparator.compare(6, 7);
        System.out.println(compare);

        //比较的是6*6和7*7，输出-1

```

高级应用

```
        Comparator<Integer> comparing = Comparator.comparing(Integer::intValue);
        System.out.println(comparing.compare(3,43));
        
        //比较的是3和43，输出-1

        //上面的Integer如果换成普通对象，一样可以使用，例如对象DevelopDoc中包含getCreateTime()方法。
        List<DevelopDoc> docs=allDocs;
        Collections.sort(docs, Comparator.comparing(DevelopDoc::getCreateTime));

```

这里要提到的是“::”这个关键字，属于java8的新特性，我们可以通过 `::` 关键字来访问类的构造方法，对象方法，静态方法。那么如何访问其中的方法呢？我们先定义一个接口：

```
    @FunctionalInterface
    static interface Te<T extends Comparable, R extends Comparable> {
        R apply(T t);
    }

```

@FunctionalInterface注解的作用是，限定该接口只能有一个可实现方法，其实不加此注解也没问题，只要不超过1个可实现方法就行，default和static方法不在范畴中。该接口定义了一个入参为T，返回为R的apply方法。我们可以这样使用它，

```
        Te<Integer,Integer> t = s -> s + s;
        System.out.println(t.apply(100));
       //100+100， 输出200

```

也可以这样使用，

```
        //intValue()是Integer类的方法
        Te<Integer, Integer> test = Integer::intValue;
        System.out.println(test.apply(100));
       //输入100,输出200

```