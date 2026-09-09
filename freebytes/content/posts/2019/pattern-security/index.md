---
title: "一个用于匹配正则表达式的工具类AntPathMatcher"
slug: pattern-security
date: 2019-12-05 10:20:26
category: java
tags: [java, java, spring]
summary: "AntPathMatcher是一个封装好的能够很方便地匹配正则表达式的工具类，它是spring框架中的源码，在我一次研究源码的过程中发现了它。"
status: published
views: 4256
---

如果你需要自己做一个登录拦截，用正则表达式来表达需要拦截或者不需要拦截的请求路径，或是你想开发别的基于匹配正则表达式的功能，可以考虑使用spring框架上一个封装了Pattern和Matcher的工具类—— org.springframework.util.AntPathMatcher 。

使用实例：

```
public static void main(String[] args) {
    AntPathMatcher antPathMatcher = new AntPathMatcher();
    boolean match1 = antPathMatcher.match("/freebytes/**", "/freebytes/1getA");
    boolean match2 = antPathMatcher.match("/freebytes/*/get*", "/freebytes/te/getA");
    boolean match3 = antPathMatcher.match("/freebytes/*/get*", "/freebytes/te/1getA");
    System.*out*.println(match1);     //true
    System.*out*.println(match2);     //true
    System.*out*.println(match3);     //false
}
```

关键是match方法，第一个参数写正则表达式，第二个参数写字符串。其实spring-security的登录拦截，也是基于这个工具类去实现的，可以看下security的应用代码，它的底层引用类就是 AntPathMatcher 。

```
@Override
public void configure(HttpSecurity http) throws Exception {
        http.csrf().disable()
        .authorizeRequests()
                .**antMatchers**("/web/user/**").**permitAll()**
**                .**antMatchers**("/web/").authenticated()
                .**anyRequest**().permitAll()
        ;
}
```