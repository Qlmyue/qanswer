---
title: "Linux文件权限和所属管理"
slug: linux-filemanage
date: 2019-08-05 08:11:42
category: Linux
status: published
views: 1437
---

Linux上的文件权限管理和所属管理，其实也就是给不同用户分配对文件的的读、写、执行三个权限的管理。使用到的命令主要包括 ls -l ，chmod，chown。
进入一个test目录，使用 ls -l 命令查看所有文件的权限等属性——

```
ls -l

-rw-r--r-- 1 root root 0 Aug  5 15:01 file1
-rw-r--r-- 1 root root 0 Aug  5 15:01 file2
-rw-r--r-- 1 root root 0 Aug  5 15:01 file3
```

上面列出了三条记录，从左到右的所有列，分表代表：文件属性(-rw-r--r--)、文件个数(1)、所属用户(root )、所属用户组(root )、文件大小(0)、创建时间(Aug  5 15:01)、文件名(file1)。

先说文件属性吧，文件属性从左至右一共10个位置，第1个位置表示文件的连接属性，l代表软连接，d代表硬连接；后续的九个位置，等分为三组，每组占三个位置。分别表示文件所属用户的操作权限（rw-）、文件所属用户组的操作权限（r--）、其他用户对该文件的操作权限（r--）。

其中，r代表可读、w代表可写、x代表可执行。
如需要改变文件所属用户及用户组，使用chown命令：

```
chown mysql:mysql file2
```

第一个mysql表示用户本身，第二个mysql表示用户组。
再查看文件ls -l:

```
-rw-r--r-- 1 root  root  10 Aug  5 15:11 file1
-rw-r--r-- 1 mysql mysql 14 Aug  5 15:31 file2
-rw-r--r-- 1 root  root  14 Aug  5 15:31 file3
```

文件所属已经发生改变了。如果需要改变文件权限，使用chmod权限：

```
chmod u=rwx,g=rwx,o=rwx file2
```

该命令涉及的u，g，o分别表示用户、用户组、其他用户，所以该命令旨在将file2文件的权限改为：对其所属用户和用户组和其他用户，均授予可读、可写、可执行的完全访问控制权限。结果如下：

```
-rw-r--r-- 1 root  root  10 Aug  5 15:11 file1
-rwxrwxrwx 1 mysql mysql 14 Aug  5 15:31 file2
-rw-r--r-- 1 root  root  14 Aug  5 15:31 file3
```

这是最为直观的命令，看起来最为容易理解，但是命令本身过长，所以也有一种更方便的方式。那就是用固定的数字来表示权限：
r=4,
w=2,
x=1
这样rwx就等于1+2+4=7。于是，上面的命令，可以替换为:

```
 chmod 777 file2 
```

如果需要对整个目录文件下的所有文件都进行权限或者所属操作，那么只需要回到上级目录，然后在chown、chmod命令后面加上 -R 参数即可，如：

```
chown -R mysql:mysql test/
chmod -R 777 test/
```