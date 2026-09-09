---
title: "从最简单的示例开始——Shiro学习（2）"
slug: shiro-samples-2
date: 2020-11-30 15:49:58
category: java
tags: [java, java, shiro]
status: published
views: 1455
---

用最简单的api，搭建一个最简单的demo。首先建立一个maven项目，pom文件如下：

```

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.8.0</version>
                <configuration>
                    <source>1.6</source>
                    <target>1.6</target>
                    <encoding>${project.build.sourceEncoding}</encoding>
                </configuration>
            </plugin>

            <!-- This plugin is only to test run our little application.  It is not
                 needed in most Shiro-enabled applications: -->
            <plugin>
                <groupId>org.codehaus.mojo</groupId>
                <artifactId>exec-maven-plugin</artifactId>
                <version>1.1</version>
                <executions>
                    <execution>
                        <goals>
                            <goal>java</goal>
                        </goals>
                    </execution>
                </executions>
                <configuration>
                    <classpathScope>test</classpathScope>
                    <mainClass>Tutorial</mainClass>
                </configuration>
            </plugin>
        </plugins>
    </build>

    <dependencies>
        <dependency>
            <groupId>org.apache.shiro</groupId>
            <artifactId>shiro-core</artifactId>
            <version>1.4.1</version>
        </dependency>
        <!-- Shiro uses SLF4J for logging.  We'll use the 'simple' binding
             in this example app.  See http://www.slf4j.org for more info. -->
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-simple</artifactId>
            <version>1.7.21</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>jcl-over-slf4j</artifactId>
            <version>1.7.21</version>
            <scope>test</scope>
        </dependency>
    </dependencies>
```

demo项目目录如图：

![](https://www.freebytes.net/wp-content/uploads/2020/11/image-3.png)

shiro.ini是有关用户角色、权限的配置，shiro加载用户信息的最传统的方式，就是从ini文件中获取。

```
[users]
root = secret, admin
guest = guest, guest
presidentskroob = 12345, president
darkhelmet = ludicrousspeed, darklord, schwartz
lonestarr = vespa, goodguy, schwartz

[roles]
admin = *
schwartz = lightsaber:*
goodguy = winnebago:drive:eagle5
```

如上，[users]表示用户配置，其下， 等号左边是用户名，右边的多个值以逗号相隔，第一个值是密码，后面的是角色名。

【roles】表示的是角色和权限配置，其下，等号左边是角色名，右边的多个值以逗号相隔，代表多个权限名。

在test/java/目录下，新建Tutorial类，编写shiro的代码。 shiro的核心组件是SecurityManager，每个应用程序都必须存在一个SecurityManager实例，所以启动shiro的第一件事就是建立它的实例。 如下：

```
Factory<SecurityManager> factory = new IniSecurityManagerFactory("classpath:shiro.ini");
SecurityManager securityManager = factory.getInstance();
SecurityUtils.setSecurityManager(securityManager);
```

接着可以获取当前用户，但这个用户是没有认证的，因为此前并未有任何登录操作：

```
Subject currentUser = SecurityUtils.*getSubject*();
```

那么，试一下登录吧：

```
if (!currentUser.isAuthenticated()) {
    UsernamePasswordToken token = new UsernamePasswordToken("lonestarr", "vespa");
    token.setRememberMe(true);
    try {
        currentUser.login(token);
```

这里面的“lonestarr”和“vespa”正是我们在shiro.ini文件中配置的用户名和密码：

```
lonestarr = vespa, goodguy, schwartz
```

它的角色是goodguy, schwartz，而这两个角色对应的权限则是： lightsaber:*和winnebago:drive:eagle5。

接着我们测试一下它的角色和权限：

```
//是否有 schwartz 角色
if (currentUser.hasRole("schwartz")) {
    *log*.info("May the Schwartz be with you!");
}
 //是否有lightsaber:wield 权限
if (currentUser.isPermitted("lightsaber:wield")) {
    *log*.info("You may use a lightsaber ring.  Use it wisely.");
} 
 //是否有 winnebago:drive:eagle5权限 
if (currentUser.isPermitted("winnebago:drive:eagle5")) {
    *log*.info("You are permitted to!");
}
```

完整的示例代码如下：

```
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.*;
import org.apache.shiro.config.IniSecurityManagerFactory;
import org.apache.shiro.mgt.SecurityManager;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.util.Factory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Tutorial {

    private static final transient Logger log = LoggerFactory.getLogger(Tutorial.class);

    public static void main(String[] args) {
        log.info("My First Apache Shiro Application");

        Factory<SecurityManager> factory = new IniSecurityManagerFactory("classpath:shiro.ini");
        SecurityManager securityManager = factory.getInstance();
        SecurityUtils.setSecurityManager(securityManager);

        // get the currently executing user:
        Subject currentUser = SecurityUtils.getSubject();

        // Do some stuff with a Session (no need for a web or EJB container!!!)
        Session session = currentUser.getSession();
        session.setAttribute("someKey", "aValue");
        String value = (String) session.getAttribute("someKey");
        if (value.equals("aValue")) {
            log.info("Retrieved the correct value! [" + value + "]");
        }

        // let's login the current user so we can check against roles and permissions:
        if (!currentUser.isAuthenticated()) {
            UsernamePasswordToken token = new UsernamePasswordToken("lonestarr", "vespa");
            token.setRememberMe(true);
            try {
                currentUser.login(token);
            } catch (UnknownAccountException uae) {
                log.info("There is no user with username of " + token.getPrincipal());
            } catch (IncorrectCredentialsException ice) {
                log.info("Password for account " + token.getPrincipal() + " was incorrect!");
            } catch (LockedAccountException lae) {
                log.info("The account for username " + token.getPrincipal() + " is locked.  " +
                        "Please contact your administrator to unlock it.");
            }
            // ... catch more exceptions here (maybe custom ones specific to your application?
            catch (AuthenticationException ae) {
                //unexpected condition?  error?
            }
        }

        //say who they are:
        //print their identifying principal (in this case, a username):
        log.info("User [" + currentUser.getPrincipal() + "] logged in successfully.");

        //test a role:
        if (currentUser.hasRole("schwartz")) {
            log.info("May the Schwartz be with you!");
        } else {
            log.info("Hello, mere mortal.");
        }

        //test a typed permission (not instance-level)
        if (currentUser.isPermitted("lightsaber:wield")) {
            log.info("You may use a lightsaber ring.  Use it wisely.");
        } else {
            log.info("Sorry, lightsaber rings are for schwartz masters only.");
        }

        //a (very powerful) Instance Level permission:
        if (currentUser.isPermitted("winnebago:drive:eagle5")) {
            log.info("You are permitted to 'drive' the winnebago with license plate (id) 'eagle5'.  " +
                    "Here are the keys - have fun!");
        } else {
            log.info("Sorry, you aren't allowed to drive the 'eagle5' winnebago!");
        }

        //all done - log out!
        currentUser.logout();

        System.exit(0);
    }
}
```