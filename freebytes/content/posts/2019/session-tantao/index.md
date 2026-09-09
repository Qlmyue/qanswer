---
title: "session深入探讨"
slug: session-tantao
date: 2019-08-17 10:22:29
category: java
tags: [java, java, session, 精品]
summary: " session，会话，其实是一个容易让人误解的词。它总跟web系统的会话挂钩，利用session，javaweb项目实现了登录状态的控制。"
status: published
views: 2180
---

## 简介

       session，会话，其实是一个容易让人误解的词。它总跟web系统的会话挂钩，利用session，javaweb项目实现了登录状态的控制。坊间流传，关闭浏览器，就是关闭了web系统的会话。其实浏览器对于会话有自己的定义，而web系统对于会话也有自己的定义。在tomcat中，session通常是指实现了HttpSession接口的实现类。并且不存在关闭浏览器就会关闭tomcat的HttpSession这种状况。 

       session本身并不难，如果只是做登录校验之类的功能，并不需要深入了解，但难的是session和cookie的结合使用，在不同情况下浏览器对cookie的控制行为所涉及到的诸多细节，我搜查了很多资料，查看过tomcat源码，亦是没有找到全面的概述。当然我并未看过、也不知道去哪里看比较全面的关于浏览器对cookie的控制资料，如果有知道的大神，还望留言链接。本文题目，之所以说是探讨，而不是了解或者介绍，因为我自己也卡在了某个点上，由于时间关系，我不能花太多时间去研究，但又不忍心就此放弃，所以先记录下来，日后有机会再研究，这期间如有大神指点，也许能让我茅塞顿开。

## session本质

        我用的是javaweb项目，因此这里的session特指HttpSession。先来看下tomcat源码中对session的设计，在org.apache.catalina.session包下，有如下设计：

![](https://oscimg.oschina.net/oscnet/23c6f020e8ae6652ac2ea827bb72d239241.jpg)

平时所用到的HttpSession的实现类就是这个standardSession。但是我们平常所获取的HttpSession实例却是外观类StandardSessionFacade，其屏蔽了许多方法，但也增强了安全性。HttpSession提供了一些方法，来控制session或者获取session的状态，如获取session的id，获取session的创建时间，设置session的attribute，使session失效等。值得一提的是session的attribute其实是一个线程安全的hashMap：

```
    /**
     * The collection of user data attributes associated with this Session.
     */
    protected ConcurrentMap attributes = new ConcurrentHashMap<>();

```

但是，创建session、根据id获取session的方法并不在这里，而是在一个管理器中，其设计如下：

![](https://oscimg.oschina.net/oscnet/9cd1f3b9eb13af44c4f2a7d8be8d1608e59.jpg)

ManagerBase是实现了Manager接口的抽象类，实现了管理session的功能。其实现子类PersistentManagerBase拓展了将session持久化的功能。但是这里不需要讲到其子类。看ManagerBase中的一段代码：

```
    /**
     * The set of currently active Sessions for this Manager, keyed by
     * session identifier.
     */
    protected Map sessions = new ConcurrentHashMap<>();

```

由此可知，所谓的session，其实就是一个用线程安全的hashMap存储起来的实现了Session接口的standardSession对象，在hashmap中以其id为key，自身为value。

再看获取session的方法，一目了然：

```
    @Override
    public Session findSession(String id) throws IOException {
        if (id == null) {
            return null;
        }
        return sessions.get(id);
    }

```

最重要的是看其createSession方法：

```
 @Override
    public Session createSession(String sessionId) {

        if ((maxActiveSessions >= 0) &&
                (getActiveSessions() >= maxActiveSessions)) {
            rejectedSessions++;
            throw new TooManyActiveSessionsException(
                    sm.getString("managerBase.createSession.ise"),
                    maxActiveSessions);
        }

        // Recycle or create a Session instance
        Session session = createEmptySession();

        // Initialize the properties of the new session and return it
        session.setNew(true);
        session.setValid(true);
        session.setCreationTime(System.currentTimeMillis());
        session.setMaxInactiveInterval(getContext().getSessionTimeout() * 60);
        String id = sessionId;
        if (id == null) {
            id = generateSessionId();
        }
        session.setId(id);
        sessionCounter++;

        SessionTiming timing = new SessionTiming(session.getCreationTime(), 0);
        synchronized (sessionCreationTiming) {
            sessionCreationTiming.add(timing);
            sessionCreationTiming.poll();
        }
        return session;
    }

```

这个方法是在什么时候调用的呢？当浏览器访问系统时，request会解析请求中携带的jssesionid，用它去找到存在于应用中的session，但是如果没有找到，那么就会调用session的创建方法，并且生成一个新的jssessionid，返回session。

总而言之，session是存在于线程安全的map中的值，可以通过id找到，也可以使用invalidate方法销毁，但绝不会是浏览器关闭，就能对它进行销毁的。

## cookie简介

        提到session，那么cookie是不得不说的。至于cookie是什么，我就不多说了，大家都懂。直接看其内容吧：

![](https://oscimg.oschina.net/oscnet/6a7f246e8dcbea3eea60510ecc6f2ff9080.jpg)

这是一次http请求中（http://localhost:8080/test1），包含的请求和响应信息，是对一个系统的初次访问，用的是谷歌浏览器。

请求头中，包含的Cookie信息，并没有上文提到的jsessionid, 那是因为这是对系统的初次访问，系统还没生成session。但是访问之后，系统就会生成一个session，而且，会在响应流中设置响应头Set-Cookie，其值为JESSIONID=xxx。这样浏览器对localhost:8080和cookie的联系就有了记忆，浏览器会将其存储起来，可在调试工具中看到：

![](https://oscimg.oschina.net/oscnet/01bf64dcf754a79f93572ddd50b55ca8497.jpg)

那么再次访问http://localhost:8080/test1, 浏览器会主动在请求头添加包括jsession的cookie信息

![](https://oscimg.oschina.net/oscnet/7375fde74bd2fc071e24197d58bd813abe7.jpg)

系统根据这个jsessionid找到session，也就不会在响应头中添加Set-Cookie信息。

这里说一下cookie中的两个重要属性：

1. domain表示的是cookie所在的域，默认为请求的地址，如网址为www.test.com/test/test.aspx，那么domain默认为www.test.com。而跨域访问，如域A为t1.test.com，域B为t2.test.com，那么在域A生产一个令域A和域B都能访问的cookie就要将该cookie的domain设置为.test.com；如果要在域A生产一个令域A不能访问而域B能访问的cookie就要将该cookie的domain设置为t2.test.com。
2. path表示cookie所在的目录，默认为/，就是根目录。在同一个服务器上有目录如下：/test/,/test/cd/,/test/dd/，现设一个cookie1的path为/test/，cookie2的path为/test/cd/，那么test下的所有页面都可以访问到cookie1，而/test/和/test/dd/的子页面不能访问cookie2。这是因为cookie能让其path路径下的页面访问。

## 疑点

        下面，就该说下我的疑点了。

**情况1：**

        但是当我在8081的一个方法中，重定向到8080的一个路径时，发现了奇怪的现象。

8081系统的方法如下：

```
   @GetMapping("/test")
    public void get1(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpSession session = request.getSession();
        String id = session.getId();
        System.out.println(id);
        response.sendRedirect("http://localhost:8080/test1");
    }

```

8080系统的被重定向路径如下：

```
    @GetMapping("/test1")
    public void get11(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpSession session = request.getSession();
        String id = session.getId();
        System.out.println(id);
    }
```

1、初次访问localhost:8081/test 得到两次请求的信息，一次是重定向的，一次是8080的

![](https://oscimg.oschina.net/oscnet/3a88b403adf1daf781095e84ca599c9cb8e.jpg)

这说明对8081系统的初次访问，是没有发送jsessionid信息的，而8081系统生成了一个id为CAAB6AED34716A0394705BDE8CAC0042的session并设置到了响应头，再次访问8081时**理应**会带上这么一个id。

2、

![](https://oscimg.oschina.net/oscnet/5ee4eeb6d79fb2b092fbd2f4b89d95bd5ea.jpg)

这个对8080系统的请求中带有jsessionid为CAAB6AED34716A0394705BDE8CAC0042的cookie信息，要知道，我们对8080的访问也是初次的，那么为什么会带上jsessionid呢？而且这个jsessionid明显是在8081系统中生成并设置到响应头的的jsessionid。这个现象我用谷歌和edge浏览器分别尝试过，都是这样。那么是不是说明，浏览器把这个重定向到localhost:8080的请求当成是同域的请求了 。

暂且放下这个疑惑，继续往下验证。由于这个请求是对8080的系统的访问，由于是初次访问，系统根本没有id为CAAB6AED34716A0394705BDE8CAC0042的session，因此只好生成一个新的session，在响应头中增加Set-Cookie。

3、再次访问localhost:8081/test，这时根据上文说的，“再次访问8081时**理应**会带上这么一个id”，也就是在cookie中带上JSESSION=CAAB6AED34716A0394705BDE8CAC0042,  但是,我发现它带的却是在系统8080中生成的BA0D2C939ADEC087C0A5F0C9B3354891 ！！！

这就导致了8081找不到session又再次生成了一个新的session，循环往复，每次对8081的访问都会产生新的session。而这情况，我觉得很明显，是浏览器把对8081的访问当成是于8080同源的了。

基于此推论，我模拟了另一种实验情况，去掉重定向的功能：

**情况2：**

在本地开两个web服务，端口分别是8080,8081。

localhost:8081/test

```
    @GetMapping("/test")
    public void get1(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpSession session = request.getSession();
        String id = session.getId();
        System.out.println(id);

    }
```

localhost:8080/test1

```
    @GetMapping("/test1")
    public void get11(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpSession session = request.getSession();
        String id = session.getId();
        System.out.println(id);
    }
```

1、第一次访问8081/test

![](https://oscimg.oschina.net/oscnet/3880ee80d32f2b215496c9b300706d84ab3.jpg)

没有cookie，服务器设置set-cookie，正常。

2、第二次访问8081/test

![](https://oscimg.oschina.net/oscnet/39b274853133a4c00bc79c8cb7aad3e3f46.jpg)

cookie与上次的set-cookie一致，正常。

3、第一次访问8080/test1

![](https://oscimg.oschina.net/oscnet/1d0a4cc84b2862b07616706433a563d36d3.jpg)

浏览器把8081/test的cookie发过去了。8080的服务器找不到这个jsessionid，又重新设置了jsessionid，等到再次访问8081/test时，大家也能猜到会发生什么了吧。

## 推论

至此，我斗胆推论，浏览器会对同一ip不同端口的服务访问认定是可以进行cookie共享的，两个cookie的domain是一致的。而这种cookie的截图也一定程度上印证了我的想法：

![](https://oscimg.oschina.net/oscnet/abc5d4936d634ad31fe3ece551e2b0128c0.jpg)

cookie的domain似乎只认定域名，无关端口。

但是根据浏览器的同源策略，同域名不同端口的访问也应该是跨域的啊。除非浏览器的域跟cookie的domain在概念上是有区别的，对于这点，我没找到确切的官方资料，但网上大神是这么说的——

![](https://oscimg.oschina.net/oscnet/fb51aed1a914240bdeb2a22f1d2e28666eb.jpg)

## 解决方案

        基于上面的未查阅官方资料而做出的不严谨的推论，我想，只要完全避免同域的情况就可以避开这个问题。于是我把8081和8080系统分别部署在两个机器上。由于不同ip，这样无论如何，两个cookie都不会是同domain的了。果然，结果是没有问题的。

## 不足

        虽然这个解决方案避开了同域的问题，但是没有彻底解决，毕竟同域的系统相互之间的访问也是有必要的，为此希望能获得更多的建议或者资料，补充这方面知识的不足，让我彻底解决这个问题。