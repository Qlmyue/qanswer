---
title: "将Registry的镜像拷贝到Harbor上"
slug: registry-harbor-copy
date: 2021-03-16 08:51:15
category: java
summary: "提供Harbor与Registry之间的镜像自动化迁移"
status: published
views: 2158
---

### 简介

Harbor跟Registry本质上是差不多的，都是管理Docker镜像的，最为明显的区别Harbor提供了可视化管理镜像的操作界面。

如果需要将Registry替换成为Harbor，那么部署好Harbor之后，需要将Registry的镜像全部迁移到Harbor。
Harbor1.x版本的时候，据说可以直接将 Registry 的镜像文件复制到Harbor的目录下，实现无缝迁移，但我没试过。
我用的是Harbor2.x版本，镜像文件不能直接复制，只能借助脚本实现自动化迁移了。

### 基本思路

基本的思路就是：
1、找到 Registry 所有的镜像版本
2、将所有 Registry 镜像版本pull到本地
3、将pull到本地的镜像打上tag标签
4、将tag好的镜像push到Harbor
5、将本地残留的镜像删除，节省空间

### 实现步骤

第一步，安装工具jq

```
yum install -y jq 
```

第二步，登录 Registry （192.168.50.51:5001）和 Harbor（ 192.168.50.50:5000）

```
docker  login  192.168.50.51:5001 
docker  login  192.168.50.50:5000 
```

第三步，登录Harbor页面，创建一个项目：freebytes

第四步，创建脚本transport.sh，将所有镜像上传到harbor的freebytes项目下

```
#!/bin/bash
images=`curl -s -u admin:admin123 192.168.50.51:5001/v2/_catalog | jq .repositories[] | tr -d '"'`

for image in $images;
do
   
    tags=`curl -s -u admin:admin123 192.168.50.51:5001/v2/$image/tags/list | jq .tags[] | tr -d '"'`
    for tag in $tags 
    do 
        echo "--------one step: pull $image:$tag-----------------"
        docker pull 192.168.50.51:5001/$image:$tag
        echo "--------second step: tag $image-----------------" 
        docker tag  192.168.50.51:5001/$image:$tag  192.168.50.50:5000/freebytes/$image:$tag
        echo "--------third step: push $image:$tag---------------" 
        docker push 192.168.50.50:5000/freebytes/$image:$tag
        echo "--------four step: remove local $image:$tag--------"
        docker rmi 192.168.50.51:5001/$image:$tag
        docker rmi 192.168.50.50:5000/freebytes/$image:$tag
        #break
    done
    #break
done
```

第五步，切换为root身份，并执行脚本

```
sudo sh ./transport.sh
```

如此，只待传输完成，便大功告成。

### 单个镜像复制

这里提供另一个脚本，可以手动输入镜像名称，使得Registry的对应镜像自动复制到Harbor的对应项目下。

```
#!/bin/bash

for((i=0;i<20;))
do
  read -t 30 -p "请输入镜像名称:" image
  read -t 30 -p "请输入目标项目名称:" target
  echo -e "\n"
  echo "镜像为：$image, 传输到harbor的target项目下"

  tags=`curl -s -u admin:admin123 192.168.50.51:5001/v2/$image/tags/list | jq .tags[] | tr -d '"'`
    for tag in $tags 
    do 
        echo "--------one step: pull $image:$tag-----------------"
        docker pull 192.168.50.51:5001/$image:$tag
        echo "--------second step: tag $image-----------------" 
        docker tag  192.168.50.51:5001/$image:$tag  192.168.50.50:5000/$target/$image:$tag
        echo "--------third step: push $image:$tag---------------" 
        docker push 192.168.50.50:5000/$target/$image:$tag
        echo "--------four step: remove local $image:$tag--------"
        docker rmi 192.168.50.51:5001/$image:$tag
        docker rmi 192.168.50.50:5000/$target/$image:$tag
        #break
    done
    #break
done
 
```