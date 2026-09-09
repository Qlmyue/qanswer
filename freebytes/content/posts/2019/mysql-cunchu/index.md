---
title: "MySQL 存储过程 自定义函数"
slug: mysql-cunchu
date: 2019-08-22 01:12:32
category: 数据库
status: published
views: 1689
---

### **一. 定义**

        存储过程 Procedure 是一组为了完成特定功能的 SQL 语句集合，经编译后存储在数据库中，用户通过指定存储过程的名称并给出参数来执行。存储过程中可以包含逻辑控制语句和数据操纵语句，它可以接受参数、输出参数、返回单个或多个结果集以及返回值。

        以上是官方的定义。简单来说，如果把sql当成是代码，其实存储过程就相当于函数。把一组具备特定功能的sql语句封装成起来而已。所以他的本质是为了更好的执行对数据库的操作。那么好在哪里呢？

### **二. 存储过程的优势**

        1. 性能。存储过程在创建时就已经在数据库服务器中编译好并存储起来，调用时只需提供过程名和参数，就可以直接使用。而sql语句，没执行一句就要编译一次，这在sql语句发送并不频繁的情况下还好，但是如果短时间大量发送sql语句的情况下，不仅会降低网络性能也会增加数据库负担。

        2. 可完成更复杂的数据库控制。由于存储过程中可以包含逻辑控制语句和数据操纵语句，类似遍历、if这种逻辑可以直接卸载过程中。

        3.我在程序中写了一段代码，发送一千条sql插入语句到本地数据库，大概花了6672ms，而在存储过程中只花了4689ms。以下分别是代码和存储过程sql：

```
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public static final String INSERT_SQL="insert into user (id, name, age) values(?,?,?)";

    public void insert(){
        long begin = System.currentTimeMillis();
        for (int i = 600000; i < 601000; i++) {
            jdbcTemplate.update(INSERT_SQL,i,"林"+i,10+Math.random()*10);
        }
        long end = System.currentTimeMillis();
        System.out.println(end-begin);
    }
```

```
CREATE PROCEDURE test_insert2 () 

BEGIN
DECLARE i INT DEFAULT 601000;
WHILE i<602000
DO
insert into `user` (id,NAME,age) values (i,CONCAT('林',i),18); 
SET i=i+1;
END WHILE;
COMMIT;
END;

CALL test_insert2()
```

### **三. 存储过程基本语法和变量讲解**

        1. delimiter //     该语句指定MySQL把“//”当作分隔符。也就是说，如果你在MySQL client中输入这句，则“；”符号不再被当作结束符。

        2. create procedure getAllUser()    表示创建存储过程，其名为getAllUser()。

        3. call getAllUser ;       调用存储过程getAllUser。

        4. drop procedure getAllUser;   删除存储过程。

        5. begin...end  之间编写过程体，即写sql语句和逻辑代码。

        6. 存储过程根据需要可能会有输入、输出、输入输出参数，如果有多个参数用","分割开。MySQL存储过程的参数用在存储过程的定义，共有三种参数类型,IN,OUT,INOUT:

- **IN**参数的值必须在调用存储过程时指定，在存储过程中修改该参数的值不能被返回，为默认值
- **OUT****:**该值可在存储过程内部被改变，并可返回
- **INOUT****:**调用时指定，并且可被改变和返回

### 四. 分别在MySQL client中和Navicat中创建存储过程

- 在client创建一个查询所有user表记录的过程。

![](https://oscimg.oschina.net/oscnet/9ff818539b4d2b72877319c4488e3d3fb80.jpg)

![](https://oscimg.oschina.net/oscnet/95ce730b29733b112f52c833a0804891c26.jpg)

        最后输入 还原分隔符为 “；”

![](https://oscimg.oschina.net/oscnet/324425e69eea7db99ec1f257ecb42d3ec4a.jpg)

        调用过程

![](https://oscimg.oschina.net/oscnet/259b324974fbcfda2c7498ca52b68edcc11.jpg)

        删除过程

- 在Navicat中创建一个插入user表数据的存储过程 ，并且传递两个参数

![](https://oscimg.oschina.net/oscnet/094d5724e3205df3d5144e6ff3b4f52c747.jpg)

        右键新建函数，选择过程

![](https://oscimg.oschina.net/oscnet/39419dc88924064b15651bca0f69c261aaa.jpg)

![](https://oscimg.oschina.net/oscnet/4314ccb851098629336ecf0b6cd1df14760.jpg)

![](https://oscimg.oschina.net/oscnet/1df5bc5a3cdcff3242034e2775dbb461e94.jpg)

        在这里写逻辑语句吧，完整如下：

```
BEGIN

DECLARE i INT DEFAULT initValue;
WHILE i<=endValue
DO
insert into `user` (id,NAME,age) values (i,CONCAT('林',i),18); 
SET i=i+1;
END WHILE;
COMMIT;

END
```

        这里的意思是 把第一个参数赋给变量i，当i小于第二个参数值时，一直进行while循环，每次循环i+1。

  Navicat里面点击sql预览可以看到完整的代码：

![](https://oscimg.oschina.net/oscnet/1e1842abaf4891d1aa7a92b0000b7a2af21.jpg)

 按下ctrl+s保存：

![](https://oscimg.oschina.net/oscnet/029a04a32c17bed3263222943fd887c920e.jpg)

然后运行，输入两个参数，逗号隔开：

![](https://oscimg.oschina.net/oscnet/9c11a7e6d939f0b928535eea6b47b6c354f.jpg)

就可以插入数据了。

### **五. 在java程序中调用存储过程**

```
    @Autowired
    private DataSource dataSource;
    public List getUser() {
        List users = new ArrayList(10000);
        User user = new User();
        try {
            CallableStatement callableStatement = dataSource.getConnection().prepareCall("{call getUser}");
            ResultSet rs = null; //执行查询操作，并获取结果集
            rs = callableStatement.executeQuery();
            while (rs.next()){
                user.setName(rs.getString("name"));
                user.setAge(rs.getInt("age"));
                user.setId(rs.getInt("id"));
                users.add(user);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return users;
    }
```

调用一个getUser()的存储过程，并将结果封装成实体。主要是 CallableStatement callableStatement = dataSource.getConnection().prepareCall("{call getUser}");这句代码。这里我认为应该有更成熟的调用方式才对，但是我也懒得找资料了。反正原理都一样。

### **六. 自定义函数**

mysql的自定义函数其实就是我们自己去定义类似sum（...）、max（...）这种函数，很简单，创建起来跟存储过程差不多，就不多做讲解了。

create function sum1(x int,y int) returns int(20)

begin 

        //编写函数体

return xxx ;

end ; 

使用  select sum1(215,555)

删除  drop sum1