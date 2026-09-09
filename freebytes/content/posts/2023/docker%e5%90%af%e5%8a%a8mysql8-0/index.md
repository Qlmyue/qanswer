---
title: "Docker启动mysql8.0"
slug: docker%e5%90%af%e5%8a%a8mysql8-0
date: 2023-01-09 06:56:06
category: 技术博客
status: published
views: 2870
---

docker pull mysql:8.0.30

然后运行：

```
docker run --name mysql8 -p 3306:3306 \
-v H:/mysql8/conf.d:/etc/mysql/conf.d  \
-v H:/mysql8/logs:/var/log/mysql  \
-v H:/mysql8/data:/var/lib/mysql  \
-e MYSQL_ROOT_PASSWORD=5tgbNHY^   \
-d mysql:8.0.30   \
--character-set-server=utf8mb4 \
--collation-server=utf8mb4_unicode_ci \
--lower-case-table-names=1   \
--skip-name-resolve \
--default-time-zone=+8:00 \ 
--innodb-buffer-pool-size=80M
```

注意挂载的目录换成自己的。