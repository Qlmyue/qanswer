---
title: "mybatis-plus简单实现乐观锁"
slug: mybatis-plu-leguansuo
date: 2023-02-10 10:02:05
category: java
tags: [java, java, mybatis]
status: published
views: 2459
---

springboot版本2.1.3.RELEASE
mybatis-plus版本3.5.3

配置乐观锁插件

```
@Configuration
public class MybatisPlusConfig {

    /**
     * PageHelper分页配置
     */
    @Bean
    public PageInterceptor pageInterceptor() {
        return new PageInterceptor();
    }

    /**
     * 插件配置
     */
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        //乐观锁插件
        interceptor.addInnerInterceptor(new OptimisticLockerInnerInterceptor());
        return interceptor;
    }
}

```

实体类User添加version字段, 以及对应的数据库表字段, version字段加个注解@Version . (com.baomidou.mybatisplus.annotation.Version)

```
public class User extends BaseEntity {
    @ApiModelProperty("用户名")
    private String username;
    @ApiModelProperty("密码")
    private String password;
    @ApiModelProperty("姓名")
    private String name;
    @ApiModelProperty("盐")
    private String salt;
    @ApiModelProperty("用户对应的角色集合")
    @TableField(exist = false)
    public List<Role> roles;

    @Version
    private Integer version = 0;
```

测试controller, 更新数据

```
    @ApiOperation(value = "编辑用户")
    @PostMapping("update")
    public RespBean update(@RequestBody User user) {
        //获取原来的version值
        User u = userService.getById(user.getId());
        Integer version = u.getVersion();
        //此时user对象是没有version值的,因为前端没有传过来, 需要将version值设置进去.
        //如果前端传进来了, 就不需要设值. 这是两种策略, 可根据场景选择.
        user.setVersion(version);
        boolean save = userService.updateById(user);
        if (!save) {
            return RespBean.error("error");
        }
        return RespBean.ok(user);
    }

```

测试controller, 批量更新数据

```
    @ApiOperation(value = "编辑用户")
    @PostMapping("updateBath")
    public RespBean updateBath(@RequestBody List<User> users) {
        List<User> originUsers = userService.getBaseMapper().selectBatchIds(users.stream().map(User::getId).collect(Collectors.toList()));
        Map<String, User> originMap = originUsers.stream().collect(Collectors.toMap(User::getId, Function.identity()));
        Map<String, User> newMap = users.stream().collect(Collectors.toMap(User::getId, Function.identity()));
        for (String id : originMap.keySet()) {
            User user = originMap.get(id);
            Integer version = user.getVersion();
            newMap.get(id).setVersion(version);
        }
        boolean save = userService.updateBatchById(users);
        if (!save) {
            return RespBean.error("error");
        }
        return RespBean.ok(users);
    }
```

测试的时候, 注意下数据库中的version字段是否被改变, 只要改了, 基本都是OK了.

要注意的点是, 这个乐观锁插件, 只在编辑时起效.

我这里的方案是每次更新时,都去查数据库最新的version值, 有一点耗性能, 但问题不大, 也有它的好处; 另一种方案是由前端传入version值, 就不需要在更新前查一次version了.