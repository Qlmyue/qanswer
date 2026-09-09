---
title: "Docker部署Redis"
slug: docker-start-redis
date: 2023-01-09 07:56:57
category: 技术博客
status: published
views: 2211
---

```
docker run --name redis \
-p 6379:6379  \
-v H:/redis/conf:/usr/local/etc/redis \
-v H:/redis/data:/data \
--name redis -d redis \
redis-server /usr/local/etc/redis/redis.conf
```

redis.conf可配置密码：
requirepass 123456