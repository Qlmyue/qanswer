---
title: "java开发人脸识别登录-方案（基于阿里云）"
slug: face-recognize-login
date: 2021-01-05 09:15:34
category: java
tags: [java, java, 人脸识别, 精品]
summary: "提供java开发人脸识别登录功能的方案（基于阿里云）"
status: published
views: 2694
---

### 阿里云人脸识别服务概述

阿里云目前提供在线的人脸识别相关API，不提供离线SDK。在线API收费标准参考：

[

![](https://www.freebytes.net/wp-content/uploads/2021/01/image.png)

]()

 QPS不大于2的情况下，是可以免费调用的。需要事先开通阿里云的人脸识别服务以及OSS服务。 

如果需要离线SDK，那么就不能用阿里云了，可以考虑百度云和腾讯云，腾讯云的离线SDK不支持IOS。百度云相对更强大些，支持安卓和ios设备，并且百度云的企业认证账户默认赠送 **10QPS** 。

### 开发思路

1、开通阿里云的人脸识别服务，初始化人脸数据库（一个账户默认只能开一个数据库，存五万张图片）。这里需要调用创建人脸数据库的接口。

2、开通阿里云的OSS服务，因为阿里云的人脸识别仅支持来自OSS服务的图片链接。

3、用户注册时，录入人脸照片，必须是正面的、清晰的、单人照片，保存到后台数据库的时候，同时将人脸照片上传到OSS服务上，并将OSS返回的图片URL添加到阿里云上的人脸数据库。这里需要调用OSS的上传接口，人脸样本数据添加接口。

4、用户登录时，前端调用摄像机连续拍摄，将获取的图片上传到OSS后，再进行活体检测与人脸检测。如果有一张图片检测通过，那就调用人脸搜索api，在人脸库中搜索相近的人脸，如果搜索返回的信息，符合特定阈值，那么就认定登录成功。这里需要调用OSS的上传接口，活体检测、人脸检测以及人脸搜索接口，当然你也可以直接省去人脸检测。

可见阿里云也是有点坑的，开通人脸识别竟然还要绑定OSS。

### 人脸识别相关的基本API调用代码

阿里云上的相关教程：https://help.aliyun.com/product/142958.html?spm=a2c4g.11186623.6.540.1acea0e6bWteDV

这里奉上相关的API调用代码：

```
    <dependencies>
        <dependency>
            <groupId>com.aliyun</groupId>
            <artifactId>aliyun-java-sdk-core</artifactId>
            <version>4.5.14</version>
        </dependency>
        <dependency>
            <groupId>com.aliyun</groupId>
            <artifactId>aliyun-java-sdk-facebody</artifactId>
            <version>1.2.2</version>
        </dependency>
        <dependency>
            <groupId>com.aliyun</groupId>
            <artifactId>aliyun-java-sdk-imageseg</artifactId>
            <version>1.1.2</version>
        </dependency>
    </dependencies>
```

```
package net.freebytes.face;

import com.aliyuncs.DefaultAcsClient;
import com.aliyuncs.IAcsClient;
import com.aliyuncs.exceptions.ClientException;
import com.aliyuncs.exceptions.ServerException;
import com.aliyuncs.facebody.model.v20191230.*;
import com.aliyuncs.profile.DefaultProfile;
import com.google.gson.Gson;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * https://www.freebytes.net
 *
 * @author 千里明月
 */
public class FaceRecognizeService {
    private String acessKeyId;
    private String secret;
    private String regionId;

    public void setAcessKeyId(String acessKeyId) {
        this.acessKeyId = acessKeyId;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public void setRegionId(String regionId) {
        this.regionId = regionId;
    }

    private IAcsClient client;

    /**
     * 初始化客户端
     *
     * @return
     */
    public FaceRecognizeService() {
        DefaultProfile profile = DefaultProfile.getProfile(regionId, acessKeyId, secret);
        client = new DefaultAcsClient(profile);
    }

    /**
     * 创建人脸数据库
     * 阿里云平台可能会默认创建一个名为default的数据库，可以删除掉再建立新的。但只能拥有一个数据库
     *
     * @param dbName
     */
    public void createFaceDb(String dbName) {
        CreateFaceDbRequest request = new CreateFaceDbRequest();
        request.setRegionId(regionId);
        request.setName(dbName);
        try {
            CreateFaceDbResponse response = client.getAcsResponse(request);
            System.out.println(new Gson().toJson(response));
        } catch (ServerException e) {
            e.printStackTrace();
        } catch (ClientException e) {
            System.out.println("ErrCode:" + e.getErrCode());
            System.out.println("ErrMsg:" + e.getErrMsg());
            System.out.println("RequestId:" + e.getRequestId());
        }
    }

    /**
     * 添加人脸样本
     *
     * @param dbName
     * @param label
     */
    public void addFaceEntity(String dbName, String label) {
        AddFaceEntityRequest request = new AddFaceEntityRequest();
        request.setRegionId(regionId);
        request.setDbName(dbName);
        request.setEntityId(UUID.randomUUID().toString().replaceAll("-", ""));
        request.setLabels(label);
        try {
            AddFaceEntityResponse response = client.getAcsResponse(request);
            System.out.println(new Gson().toJson(response));
        } catch (ServerException e) {
            e.printStackTrace();
        } catch (ClientException e) {
            System.out.println("ErrCode:" + e.getErrCode());
            System.out.println("ErrMsg:" + e.getErrMsg());
            System.out.println("RequestId:" + e.getRequestId());
        }
    }

    /**
     * 添加人脸数据
     *
     * @param dbName
     * @param imageUrl
     * @param entityId
     * @param extraData
     */
    public void addFace(String dbName, String imageUrl, String entityId, String extraData) {
        AddFaceRequest request = new AddFaceRequest();
        request.setRegionId(regionId);
        request.setDbName(dbName);
        request.setImageUrl(imageUrl);
        request.setEntityId(entityId);
        request.setExtraData(extraData);
        try {
            AddFaceResponse response = client.getAcsResponse(request);
            System.out.println(new Gson().toJson(response));
        } catch (ServerException e) {
            e.printStackTrace();
        } catch (ClientException e) {
            System.out.println("ErrCode:" + e.getErrCode());
            System.out.println("ErrMsg:" + e.getErrMsg());
            System.out.println("RequestId:" + e.getRequestId());
        }
    }

    /**
     * 活体检测  检测是否是直接拍摄的人脸图片  还是翻拍的图片
     *
     * @param imageUrl
     */
    public void detectLiving(String imageUrl) {
        DetectLivingFaceRequest request = new DetectLivingFaceRequest();
        request.setRegionId(regionId);
        try {
            List<DetectLivingFaceRequest.Tasks> tasksList = new ArrayList<DetectLivingFaceRequest.Tasks>();
            DetectLivingFaceRequest.Tasks tasks1 = new DetectLivingFaceRequest.Tasks();
            tasks1.setImageURL(imageUrl);
            tasksList.add(tasks1);
            request.setTaskss(tasksList);
            DetectLivingFaceResponse response = client.getAcsResponse(request);
            System.out.println(new Gson().toJson(response));
        } catch (ServerException e) {
            e.printStackTrace();
        } catch (ClientException e) {
            System.out.println("ErrCode:" + e.getErrCode());
            System.out.println("ErrMsg:" + e.getErrMsg());
            System.out.println("RequestId:" + e.getRequestId());
        }
    }

    /**
     * 人脸检测   检测是否是人脸图片
     *
     * @param imageUrl
     */
    public void DetectFace(String imageUrl) {
        DetectFaceRequest request = new DetectFaceRequest();
        request.setRegionId(regionId);
        request.setImageURL(imageUrl);
        try {
            DetectFaceResponse response = client.getAcsResponse(request);
            System.out.println(new Gson().toJson(response));
        } catch (ServerException e) {
            e.printStackTrace();
        } catch (ClientException e) {
            System.out.println("ErrCode:" + e.getErrCode());
            System.out.println("ErrMsg:" + e.getErrMsg());
            System.out.println("RequestId:" + e.getRequestId());
        }
    }

    /**
     * 人脸搜索
     * 比较人脸数据库中的人脸数据，返回相近的数据
     *
     * @param dbName
     * @param imageUrl
     */
    public void searchFace(String dbName, String imageUrl) {
        SearchFaceRequest request = new SearchFaceRequest();
        request.setRegionId(regionId);
        request.setDbName(dbName);
        request.setImageUrl(imageUrl);
        //返回最高匹配度的两个值
        request.setLimit(2);
        try {
            SearchFaceResponse response = client.getAcsResponse(request);
            System.out.println(new Gson().toJson(response));
        } catch (ServerException e) {
            e.printStackTrace();
        } catch (ClientException e) {
            System.out.println("ErrCode:" + e.getErrCode());
            System.out.println("ErrMsg:" + e.getErrMsg());
            System.out.println("RequestId:" + e.getRequestId());
        }
    }

    /**
     * 人脸比对
     * 人脸搜索是1：N，而人脸比对是1：1
     *
     * @param ImageURLA
     * @param ImageURLB
     */
    public void faceThan(String ImageURLA, String ImageURLB) {
        CompareFaceRequest request = new CompareFaceRequest();
        request.setRegionId(regionId);
        request.setImageURLA(ImageURLA);
        request.setImageURLB(ImageURLB);
        try {
            CompareFaceResponse response = client.getAcsResponse(request);
            System.out.println(new Gson().toJson(response));
        } catch (ServerException e) {
            e.printStackTrace();
        } catch (ClientException e) {
            e.printStackTrace();
        }
    }
}

```