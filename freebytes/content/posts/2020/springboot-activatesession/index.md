---
title: "SpringBoot、security获取在线用户数量"
slug: springboot-activatesession
date: 2020-06-19 07:05:50
category: java
tags: [java, java, session, spring, springboot, springsecurity]
summary: "介绍可在普通tomcat项目、springboot项目、spring-security项目上获取在线用户数量的java实现。"
status: published
views: 3778
---

## session的活跃数量 

SpringBoot项目中，session的活跃数量即是在线的用户数量。而session的管理器，就是org.apache.catalina.Manager接口，其抽象实现类ManagerBase具有基本的操作session的方法，其中就有获取session活跃数的方法——

```
    /**
     * Gets the number of currently active sessions.
     *
     * @return Number of currently active sessions
     */
    public int getActiveSessions();
```

因为session与客户端的sessionID息息相关，客户端每一次的请求，都会带有sessionID，服务器根据这个id查询 Manager 中是否有有效的session，如果有，则认为该客户已经登录了。

那么也就是说，每一次的请求，都必然会与Manager发生联系，而每次的请求信息，比如sessionID，都包含在HttpServletRequest中，也就是说在一次完成的请求中，HttpServletRequest必然与Manger有操作上的联系。 （如果对session没有足够的了解，可观看我的另一篇博客[深入探讨Session]()） 

## springboot项目中从request找到Manager

基于此，我顺藤摸瓜，从 HttpServletRequest 往上找到了Request，发现了——

```
    public Context getContext() {
        return mappingData.context;
    }
```

看这个方法的命名，是不是很熟悉？就像spring的context，tomcat的context，java界的顶层程序员们，貌似都很喜欢用Context来表示一个装有很多重要信息的对象，恰巧，这个Context类里面，就有找到Manager的方法：

```
    /**
     * @return the Manager with which this Context is associated.  If there is
     * no associated Manager, return <code>null</code>.
     */
    public Manager getManager();
```

于是由上而下地，利用反射、强转的方式，强行得到了被封装在了底层的Manager对象。

```
    @GetMapping("/getSessions")
    public Map getActiveSessions(HttpServletRequest request) throws NoSuchFieldException, IllegalAccessException {
        HttpSession session = request.getSession();
        if (request instanceof RequestFacade) {
            return dissectRequest((RequestFacade) request);
        }
        return null;
    }

    private Map<String, Object> dissectRequest(RequestFacade requestFacade) throws NoSuchFieldException, IllegalAccessException {
        Map<String, Object> map = new LinkedHashMap<>(8);
        Field declaredField = requestFacade.getClass().getDeclaredField("request");
        declaredField.setAccessible(true);
        Request trueRequest = (Request) declaredField.get(requestFacade);
        ManagerBase managerBase = (ManagerBase) trueRequest.getContext().getManager();
        //printSession(managerBase, map);
        return map;
    }

```

## springboot+security项目中从session找到Manager 

但是，这是在没有使用security的情况下找到manager的方式，如果使用了security，需要从session对象本身去找到Manager。实现方式如下：

```
    @GetMapping("/getSessions")
    public Map getActiveSessions(HttpServletRequest request) throws NoSuchFieldException, IllegalAccessException {
        HttpSession session = request.getSession();
        if (session instanceof StandardSessionFacade) {
            return dissectRequest((StandardSessionFacade) session);
        }
        return null;
    }

    //使用了security或者不使用security都可以用这种方式获取Manager
    private Map<String, Object> dissectRequest(StandardSessionFacade sessionFacade) throws NoSuchFieldException, IllegalAccessException {
        Map<String, Object> map = new LinkedHashMap<>(8);
        Field sessionFacadeField = sessionFacade.getClass().getDeclaredField("session");
        sessionFacadeField.setAccessible(true);
        HttpSession httpSession = (HttpSession) sessionFacadeField.get(sessionFacade);
        if (httpSession instanceof StandardSession) {
            StandardSession standardSession = (StandardSession) httpSession;
            Field managerFiled = standardSession.getClass().getDeclaredField("manager");
            managerFiled.setAccessible(true);
            Manager manager = (Manager) managerFiled.get(standardSession);
            //printSession(manager, map);
        }
        return map;
    }
```

这里奉上github上完整的代码——[https://github.com/18826243776/springboot/tree/master/session]()

或者可以直接引入依赖——

```
<dependency>
  <groupId>net.freebytes</groupId>
  <artifactId>session-count</artifactId>
  <version>1.0</version>
</dependency>
```

访问/getSessions效果如下:

[

![](https://www.freebytes.net/wp-content/uploads/2020/06/image-1024x23.png)

]()