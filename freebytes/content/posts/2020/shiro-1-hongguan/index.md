---
title: "从宏观的角度了解Shiro——Shiro学习（1）"
slug: shiro-1-hongguan
date: 2020-11-28 16:09:08
category: java
tags: [java, java, shiro]
summary: "本文诠释了shiro的主要概念、主要功能以及一些十分基本的api使用。"
status: published
views: 1556
---

### **一、shiro主要做什么？**

1. 身份验证
2. 授权访问
3. 加密
4. 会话管理

### **二、shiro权限框架的基本开发路线**

无论是spring-security还是shiro，权限框架的基本开发路线是围绕“当前用户是谁？这个用户能做什么？”这两个问题进行的。

### **三、核心概念******

1. Subject

主体。可以算是用户的概念，只是这个用户比较广泛，它可以是任何与当前应用程序交互的事物。可通过代码Subject currentUser = SecurityUtils.getSubject();获取。

2.SecurityMangager

一个应用程序基本只有一个securityManager实例，它管理所有的subject的安全操作。它可以用ini配置文件中，加载基本的权限配置。

```
// 1。加载INI配置
Factory <SecurityManager> factory =
new IniSecurityManagerFactory（“ classpath：shiro.ini”）;
// 2。创建SecurityManager
SecurityManager securityManager = factory.getInstance（）;
// 3。使它可访问
SecurityUtils.setSecurityManager（securityManager）;
```

3.Realms

Realms就像一座桥，连接着shiro和应用程序的安全数据。当真正需要与应用程序的安全数据进行交互时，shiro会查找一个或多个realms，以进行认证和鉴权工作。

Realms本质上是一个专用于安全的DAO，它封装了连接数据源的详细信息，让相关的数据能够被shiro使用。也就是说，一般都是在realms中查询数据库信息，用于校验当前用户是否有权限进行某个操作。

### **四、subject的应用**

1.登录

Shiro将很多操作封装在了subject，使得开发者可以通过subject的api完成大部分的工作。比如说登录方法：

```
AuthenticationToken token =
new UsernamePasswordToken(username, password);
Subject currentUser = SecurityUtils.getSubject();
currentUser.login(token);
```

当登录方法被执行时，securityManager会收到token，并将它发送到各个realms中，由realms对其进行验证。

2.鉴权

```
//针对角色鉴权：
if ( subject.hasRole(“administrator”) ) {
    //show the ‘Create User’ button
}
//或者是针对更细粒度的权限鉴权
if ( subject.isPermitted(“user:create”) ) {
    //show the ‘Create User’ button
} else {
    //grey-out the button?
} 
```

当鉴权方法被执行时，securityManager也会收到通知，然后调用realms去进行校验权限的操作。

至此，大概也就明白了subject、securityManager和realms的关系——securityManager管理所有的subject，所以发生在subject上的认证、鉴权行为都会被securityManager知道，然后securityManager本身并不执行认证鉴权操作，而是交给了事先注册进来的realms去执行。

### **五、Session Management**

会话管理。Shiro试图按自己的方式，建立一套会话机制，不依赖于web容器本身的会话管理，使得shiro能够活跃在不同的容器中，甚至也能够活跃在非web容器中。

获取session的方式：

```
Session session = subject.getSession();//获取subject的已存在的会话。
Session session = subject.getSession(boolean create);//获取subject的会话，如果没有就新建。
```

可见，这些api跟tomcat的session api差不多。

问题来了，对于servlet容器而言，都有自己的一套会话机制，比如tomcat。那么当shiro和tomcat集成时，各自的会话机制如何自处呢？它会冲突吗？

——既不需要取舍，也不会造成冲突。Shiro的做法是，做一个包装器，将tomcat的session api封装到这个包装器中，这样当代码中调用session管理时，其实就是在间接使用tomcat本身的会话。如调用方法subject.getSession()时，实际上就是用调用tomcat的getSession()。

当然，你也可以完全使用shiro的本地会话，而不使用tomcat的会话。并且，这样子做了之后，你即便使用HttpServletRequest.getSession()这样的代码获取session，它依然使用的是shiro的本地会话，因为shiro将这种调用委派给了它本地的session api。

### **六、加密**

Shiro觉得JDK中的加密API相当繁琐，所以实现了自己的一套加密机制，简化加密API。

```
String encodedPassword  =  new Sha512Hash(password, salt, count).toBase64();
```

如果想要基于高级加密标准AES，实现数据加密，可以这么做：

```
AesCipherService cipherService = new AesCipherService();
cipherService.setKeySize(256);
//创建一个密钥
byte[] testKey = cipherService.generateNewKey();
//加密数据fileBytes，得到密文encrypted数组
byte[] encrypted = cipherService.encrypt(fileBytes, testKey);
```

### **七、web支持**

Shiro集成到web应用程序中，需要配置shiro的过滤器。

```
<filter>
    <filter-name>ShiroFilter</filter-name>
    <filter-class>
        org.apache.shiro.web.servlet.IniShiroFilter
    </filter-class>
    <!-- 默认从classpath跟路径下寻找shiro.ini 配置文件--> 
</filter>
<filter-mapping>
     <filter-name>ShiroFilter</filter-name>
     <url-pattern>/*</url-pattern>
</filter-mapping>
```

shiro.ini是一个配置有关权限访问的配置文件，如下：

```
[urls]
/assets/** = anon
/user/signup = anon
/user/** = user
/rpc/rest/** = perms[rpc:invoke], authc
/** = authc
```

等号左边的是web程序的访问路径，右边的是filter过滤器，过滤器可以配置多个，通过逗号隔开。shiro的过滤器有很多，上面配置写的都是这些过滤器的简称。特列出以下过滤器：

| 
   **Filter Name**
    | 
   **Class******
    |
| 
  anon
   |    org.apache.shiro.web.filter.authc.AnonymousFilter    |
| 
  authc
   |    org.apache.shiro.web.filter.authc.FormAuthenticationFilter    |
| 
  authcBasic
   |    org.apache.shiro.web.filter.authc.BasicHttpAuthenticationFilter    |
| 
  authcBearer
   |    org.apache.shiro.web.filter.authc.BearerHttpAuthenticationFilter    |
| 
  invalidRequest
   |    org.apache.shiro.web.filter.InvalidRequestFilter    |
| 
  logout
   |    org.apache.shiro.web.filter.authc.LogoutFilter    |
| 
  noSessionCreation
   |    org.apache.shiro.web.filter.session.NoSessionCreationFilter    |
| 
  perms
   |    org.apache.shiro.web.filter.authz.PermissionsAuthorizationFilter    |
| 
  port
   |    org.apache.shiro.web.filter.authz.PortFilter    |
| 
  rest
   |    org.apache.shiro.web.filter.authz.HttpMethodPermissionFilter    |
| 
  roles
   |    org.apache.shiro.web.filter.authz.RolesAuthorizationFilter    |
| 
  ssl
   |    org.apache.shiro.web.filter.authz.SslFilter    |
| 
  user
   |    org.apache.shiro.web.filter.authc.UserFilter    |