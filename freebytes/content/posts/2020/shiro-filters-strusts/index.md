---
title: "shiro的过滤器架构——Shiro学习（5）"
slug: shiro-filters-strusts
date: 2020-12-29 10:29:34
category: java
tags: [java, java, shiro]
status: published
views: 1432
---

shiro的过滤器组织非常庞大，如下图：

[

![](https://www.freebytes.net/wp-content/uploads/2020/12/image-2-1024x580.png)

]()

NameableFilter代表的是命名规范，旨在为每一个过滤器命名。提供setName()和getName()接口。

OncePerRequestFilter，确保在一次请求中只通过一次filter。定义了一个doFilterInternal()方法，表示本过滤器的过滤逻辑。在执行过滤器链filterChain.doFilter(request, response) 前，会先判断是否已经执行过本过滤器，如果没有就先执行doFilterInternal，再执行过滤器链。

AdviceFilter，定义过滤器执行的前后操作。关键方法是preHandle()和postHandle()。

PathMatchingFilter，路径匹配过滤器，内部维护一个AntPathMatcher正则表达式匹配器。专门判断当前请求url是否符合类似/user/**这样的正则表达式，如果不符合就返回false。

AccessControlFilter，定义访问成功后和访问失败后的操作。

AuthenticatingFilter，定义身份认证过滤器。

AuthorizationFilter，定义鉴权过滤器。