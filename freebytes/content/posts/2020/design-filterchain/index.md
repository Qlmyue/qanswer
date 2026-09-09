---
title: "设计模式之责任链模式"
slug: design-filterchain
date: 2020-07-02 09:49:50
category: java
tags: [java, java, 设计模式]
summary: "在责任链模式里，一个对象表示链的一个节点，由多个节点对象组成了一条有先后顺序的链对象。有些链对象内部会维护一个数组，来存储这些节点对象，有些则是在每个节点中声明下个节点的引用。"
status: published
views: 1596
---

### 责任链模式

在责任链模式里，一个对象表示链的一个节点，由多个节点对象组成了一条有先后顺序的链对象。有些链对象内部会维护一个数组，来存储这些节点对象，有些则是在每个节点中声明下个节点的引用。

Tomcat中的Filter以及SpringSecurity的拦截器就是使用了责任链模式。

### 案例1

使用责任链模式对一个http的请求url进行解析。只有责任处理者和被处理者角色。由多个责任处理者构成责任链。

```
/**
 * 责任处理者
 * 负责处理url
 */
public abstract class Handler {

    public Handler handler;
    //处理url
    public abstract void handleRequest(URLEntity urlEntity,String url) throws MalformedURLException;

    public Handler getHandler() {
        return handler;
    }

    public void setHandler(Handler handler) {
        this.handler = handler;
    }
}

```

```
//负责处理域名
public class HostHandler extends Handler {

    @Override
    public void handleRequest(URLEntity urlEntity, String url) throws MalformedURLException {
        URL urlInstance = new URL(url);
        String host = urlInstance.getHost();
        urlEntity.setHost(host);
        if (getHandler() != null) {
            getHandler().handleRequest(urlEntity, url);
        }
    }
}

//负责处理端口
public class PortHandler extends Handler {

    @Override
    public void handleRequest(URLEntity urlEntity, String url) throws MalformedURLException {
        URL urlInstance = new URL(url);
        int port = urlInstance.getPort();
        urlEntity.setPort(port);
        if (getHandler() != null) {
            getHandler().handleRequest(urlEntity, url);
        }
    }
}

//负责处理参数
public class QueryHandler extends Handler{

    @Override
    public void handleRequest(URLEntity urlEntity, String url) throws MalformedURLException {
        URL urlInstance = new URL(url);
        String query = urlInstance.getQuery();
        urlEntity.setQuery(query);
        if (getHandler() != null) {
            getHandler().handleRequest(urlEntity, url);
        }
    }
}
```

```
//被处理者
public class URLEntity {
    private String host;
    private Integer port;
    private String query;

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public Integer getPort() {
        return port;
    }

    public void setPort(Integer port) {
        this.port = port;
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }
}
```

```
//执行类
public class App {
    public static void main(String[] args) throws MalformedURLException {
        //构建责任链
        Handler hostHandler = new HostHandler();
        Handler portHandler = new PortHandler();
        Handler queryHandler = new QueryHandler();
        hostHandler.setHandler(portHandler);
        portHandler.setHandler(queryHandler);
        URLEntity urlEntity = new URLEntity();
        hostHandler.handleRequest(urlEntity,"http://192.168.50.103:8080/test?username=lin");
        System.out.println(urlEntity.getHost());
        System.out.println(urlEntity.getPort());
        System.out.println(urlEntity.getQuery());
    }
}
```

### 案例2

使用责任链模式对一个http的请求url进行解析。有责任处理者和被处理者角色，以及链角色。由链角色负责构建处理者的链。

```
/**
 * 责任处理者
 * 负责处理url
 */
public interface Filter {
     void doFilter(URLEntity urlEntity, String url, FilterChain chain) throws Exception;
}
```

```
//负责处理域名
public class HostHandler extends Handler {

    @Override
    public void handleRequest(URLEntity urlEntity, String url) throws MalformedURLException {
        URL urlInstance = new URL(url);
        String host = urlInstance.getHost();
        urlEntity.setHost(host);
        if (getHandler() != null) {
            getHandler().handleRequest(urlEntity, url);
        }
    }
}

//负责处理端口
public class PortHandler extends Handler {

    @Override
    public void handleRequest(URLEntity urlEntity, String url) throws MalformedURLException {
        URL urlInstance = new URL(url);
        int port = urlInstance.getPort();
        urlEntity.setPort(port);
        if (getHandler() != null) {
            getHandler().handleRequest(urlEntity, url);
        }
    }
}

//负责处理参数
public class QueryHandler extends Handler{

    @Override
    public void handleRequest(URLEntity urlEntity, String url) throws MalformedURLException {
        URL urlInstance = new URL(url);
        String query = urlInstance.getQuery();
        urlEntity.setQuery(query);
        if (getHandler() != null) {
            getHandler().handleRequest(urlEntity, url);
        }
    }
}
```

```
///被处理者
public class URLEntity {
    private String host;
    private Integer port;
    private String query;

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public Integer getPort() {
        return port;
    }

    public void setPort(Integer port) {
        this.port = port;
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }
}
```

```
/**
 * 责任链对象
 */
public class FilterChain  implements Filter{
    List<Filter> filters = new ArrayList<Filter>();
    int index=0;
    public FilterChain addFilter(Filter f) {
        filters.add(f);
        return this;
    }
    @Override
    public void doFilter(URLEntity urlEntity, String url,FilterChain chain) throws Exception {
        //index初始化为0,filters.size()为3，不会执行return操作
        if(chain.index==chain.filters.size()){
            return;
        }
        //每执行一个过滤规则，index自增1
        Filter f=chain.filters.get(index);
        chain.index++;
        f.doFilter(urlEntity,url,chain);
    }
}
```

```
//执行类
public class App {
    public static void main(String[] args) throws Exception {
        //构建责任链
        FilterChain filterChain = new FilterChain();
        filterChain.addFilter(new HostFilter()).
                addFilter(new PortFilter()).
                addFilter(new QueryFilter());
        URLEntity urlEntity = new URLEntity();
        String url ="http://192.168.50.103:8080/test?username=lin";
        filterChain.doFilter(urlEntity,url,filterChain);
        System.out.println(urlEntity.getHost());
        System.out.println(urlEntity.getPort());
        System.out.println(urlEntity.getQuery());
    }
}
```