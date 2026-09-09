---
title: "ElasticSearch和Kibana配置外部访问"
slug: elasticsearch-kibana-ip
date: 2022-01-13 06:26:15
category: java
tags: [elasitcSearch, java, java]
status: published
views: 1932
---

es版本（7.15.2），elasticsearch.yml配置：

cluster.name: es-cluster
node.name: es-0
network.host: 0.0.0.0
cluster.initial_master_nodes: ["es-0"]

kibana版本（7.15.2），kibana.yml配置：

server.host: 0.0.0.0

就这么简单！注意下，es和kibana的版本要匹配。

此时可以用http://ip:9200访问es，用http://ip:5601访问kibana。