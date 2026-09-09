---
title: "代码实现最简单的kafka生产者和消费者"
slug: kafka-consumer-producer-base-code
date: 2021-08-09 15:17:28
category: java
tags: [java, java, kafka]
summary: "本文用最简单的代码实现最简单的kafka生产者和消费者"
status: published
views: 1278
---

1、开启zookeeper和kafka服务，并创建topic：topic-1。

2、建立一个maven项目。

3、引入maven依赖：

```
        <dependency>
            <groupId>org.apache.kafka</groupId>
            <artifactId>kafka-clients</artifactId>
            <version>2.8.0</version>
        </dependency>
```

4、编写消息回调类：

```
package net.freebytes.kafka.ks;

import org.apache.kafka.clients.producer.RecordMetadata;
import org.apache.kafka.clients.producer.Callback;

/**
 * kafka消息发送成功的回调类
 *
 * @author 千里明月
 * @date 2021/8/4 23:07
 */
public class ProducerCallback implements Callback {

    private long startTime;
    private int key;
    private String message;

    public ProducerCallback(long startTime, int key, String message) {
        this.startTime = startTime;
        this.key = key;
        this.message = message;
    }

    /**
     * 回调方法
     *
     * @author 千里明月
     * @date 2021/8/9
     **/
    @Override
    public void onCompletion(RecordMetadata metadata, Exception e) {
        long duration = System.currentTimeMillis() - startTime;
        if (metadata != null) {
            System.out.println("key=" + key + ",value=" + message + ",partition=" + metadata.partition() + ",offset=" + metadata.offset() + ",duration=" + duration);
        } else {
            e.printStackTrace();
        }
    }

}
```

5、编写消息生产者类：

```
package net.freebytes.kafka.ks;

import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.clients.producer.RecordMetadata;

import java.util.Properties;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

/**
 * 生产者
 *
 * @author 千里明月
 * @date 2021/8/4 22:38
 */
public class Producer {

    public static void main(String[] args) throws ExecutionException, InterruptedException {
        Properties properties = new Properties();
        properties.setProperty("bootstrap.servers", "localhost:9092");
        properties.setProperty("client.id", "client-1");
        properties.setProperty("key.serializer", "org.apache.kafka.common.serialization.IntegerSerializer");
        properties.setProperty("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");
        KafkaProducer<Integer, Object> producer = new KafkaProducer<>(properties);

        //topic名
        String topic = "topic-1";
        int key = 1;
        while (true) {
            Thread.sleep(1000);
            //发送的消息
            String msg = "message_" + key++;
            Future<RecordMetadata> result = producer.send(new ProducerRecord<>(topic, key, msg), new ProducerCallback(System.currentTimeMillis(), key, msg));
            //等待消息发送
            result.get();
        }
    }

}

```

6、编写消息消费者类：

```
package net.freebytes.kafka.ks;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import java.util.Arrays;
import java.util.Properties;

/**
 * 消费者
 *
 * @author 千里明月
 * @date 2021/8/4 22:38
 */
public class Consumer {

    public static void main(String[] args) {
        Properties properties = new Properties();
        properties.setProperty("bootstrap.servers", "localhost:9092");
        properties.setProperty("group.id", "test");
        properties.setProperty("enable.auto.commit", "true");
        properties.setProperty("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
        properties.setProperty("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
        KafkaConsumer<String, String> consumer = new KafkaConsumer<>(properties);

        //topic名
        String topic = "topic-1";

        consumer.subscribe(Arrays.asList(topic));

        try {
            while (true) {
                //每秒拉取一次消息
                ConsumerRecords<String, String> records = consumer.poll(1000);
                for (ConsumerRecord<String, String> record : records) {
                    //输出消息
                    System.out.println("offset = " + record.offset() + ", key = " + record.key() + ", value = " + record.value());
                }
            }
        } finally {
            //关闭消费者
            consumer.close();
        }
    }

}

```

可在gitee上查看项目源码：

[https://gitee.com/freebytes/kafka-study.git]()