---
title: "shiro的授权原理与架构简化——Shiro学习（4）"
slug: shiro-study-4
date: 2020-12-09 09:23:22
category: java
tags: [java, java, shiro]
summary: "本文简写授权原理，主要为了提出认证与鉴权的架构简化的想法。"
status: published
views: 1490
---

看此文之前，应先看上篇文章[shiro的身份认证原理]()，因为授权和认证的架构、流程、原理都是差不多的。它涉及到Subject、SecurityManager、Authorizer、Realm这几个概念，跟认证相比，仅仅是将Authenticator换成了 Authorizer 。

shiro的授权，我推荐一篇介绍得十分详细的博文，写得很好，https://www.iteye.com/blog/jinnianshilongnian-2020017
我这里就不再做锦上添花的活了。

但是我想提一下，我觉得对于大部分小众项目来说，shiro的认证和鉴权架构还是有点冗余了。我觉得可以直接去掉Realm的概念，将架构简化为：

Subject---> SecurityManager ---> Authorizer/ Authenticator 

这样一来，我们就无需去自定义一个Realm的实现类并重写Realm的认证、 鉴权 逻辑，也不必理会 Realm 下的密码校验器CredentialsMatcher。我们可以直接定义一个 Authenticator 的实现类，在里面重写认证的逻辑；直接定义一个 Authorizer的实现类，在里面重写鉴权的逻辑。

那么体现在代码上，大体就是这样的：

```
DefaultWebSecurityManager securityManager = new DefaultWebSecurityManager();
securityManager.setAuthenticator(new Authenticator() {
     @Override
     public AuthenticationInfo authenticate(AuthenticationToken token) throws AuthenticationException {
         AuthenticationInfo info = null;
         //todo 认证身份的相关逻辑
         return info;
      }
});
```

但是我悲催的发现，实现 Authorizer 需要覆写的方法太多了。。。要全部覆写的话就太麻烦。接着我又想去继承它的抽象子类，然后再重写关键方法，但是它的抽象子类是ModularRealmAuthorizer。。。所以鉴权这部分始终还是绕不开Realm这个坎。白花了我这点小心思！