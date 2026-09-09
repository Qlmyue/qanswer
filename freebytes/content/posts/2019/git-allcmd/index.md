---
title: "Git命令大全"
slug: git-allcmd
date: 2019-11-26 09:51:52
category: 技术博客
summary: "总结了一下git使用的高频命令和基本命令"
status: published
views: 1868
---

## 基本命令

| 初始化git目录  |  git init  |
| 克隆远程项目   |  git clone  |
| 为远程仓库添加用户名  |  git remote add [用户名] [远程仓库链接]   |
| 添加文件到暂存区   |  git add [文件]  |
| 提交文件到本地版本库中   |  git commit -m "commit message"   |
| 推送分支到远程仓库中  |  git push 【用户名】 【分支名】  |
| 查看本地文件状态       |   git status  |

## 分支

| 查看分支  |  git branch  |
| 查看远程分支  |  git branch -r  |
| 创建分支  |  git  branch  【分支名】 |
| 切换分支  |  git checkout【分支名】  |
| 创建+切换分支  |  git checkout -b 【旧分支名】【新分支名】 |
| 合并某分支到当前分支  |  git merge 【分支名】 |
|  删除分支  |  git branch -d   |

## 标签

|  查看所有tag  |  git tag  |
|  新建一个标签，默认为HEAD  |  git tag <tagname>  |
|  指定commit-id上新建标签  |  git tag <tagname> <commit-id>  |
|  新建标签时，【-m】添加标签说明  |  git tag -a <tagname> -m "blablabla..." <commit-id>  |
|  推送一个本地标签  |  git push origin <tagname>  |
|  删除一个本地标签  |  git tag -d <tagname>  |
|  删除一个远程标签  |  git push origin :refs/tags/<tagname>  |

## 历史

|  查看提交历史  |  git log  --pretty=oneline  |
|  查看命令历史  |  git reflog  |

## 用户名配置

| 配置全局用户名 |  git config --global user.name "Your Name" |
|  配置全局邮箱 |   git config --global user.email "email@example.com"   |
| 查看本地用户名 |  git config user.name  |
|  查看本地邮箱 |  git config user.email   |
| 修改本地用户名 |  git config  user.name "xxx"  |
| 在本地生成一个文本，上边记录你的账号和密码,目录是~/.git-credentials |  git config –global credential.helper store   |

## 撤销修改

|  撤销工作区，即回到本地仓库【最后一次提交】的状态  |  git checkout -- <file>  |
|  撤销暂存区的  |  git reset HEAD <file>  |

## git stash

应用场景——

1 、当你正在dev分支上写某个类文件时，一个同事也在改这个类文件，并且他先一步提交了。然后你也提交自己的代码，发现提交不了。此时你先pull他的代码也可能会因为分歧而pull不成功，那么你可以先使用stash指令将你的代码存起来，再pull同事的代码下来，然后再stash pop弹出你的代码，最后修正后再提交。

2 、当正在dev分支上开发某个项目，这时项目中出现一个bug，需要紧急修复，但是正在开发的内容只是完成一半，还不想提交，这时可以用git stash命令将修改的内容保存至堆栈区，然后顺利切换到hotfix分支进行bug修复，修复完成后，再次切回到dev分支，从堆栈中恢复刚刚保存的内容。

3、由于疏忽，本应该在dev分支开发的内容，却在master上进行了开发，需要重新切回到dev分支上进行开发，可以用git stash将内容保存至堆栈中，切回到dev分支后，再次恢复内容即可。

总的来说，git stash命令的作用就是将目前还不想提交的但是已经修改的内容进行保存至堆栈中，后续可以在某个分支上恢复出堆栈中的内容。这也就是说，stash中的内容不仅仅可以恢复到原先开发的分支，也可以恢复到其他任意指定的分支上。git stash作用的范围包括工作区和暂存区中的内容，也就是说没有提交的内容都会保存至堆栈中。

|  git stash [save message]  | 能够将所有未提交的修改（工作区和暂存区）
保存至堆栈中，用于后续恢复当前工作目录  |
|  git stash list  |  所有保存的记录列表  |
|  git stash pop  |  该命令将堆栈中最近一条保存的记录弹出到工作区，并从堆栈中删除该记录  |
|  git stash apply  |  将堆栈中的内容应用到当前目录  |
|  git stash drop 【名称】  |  git stash clear  |
|  git stash clear  |  清除堆栈中的所有 内容  |
|   git stash show  |  查看堆栈中最新保存的stash和当前目录的差异。  |
|  git stash branch  |  从最新的stash创建分支 |

## 远程分支版本回退

步骤：1.切换到对应分支。2.拉取当前分支的最新代码。3.重置到指定回退的版本。4.将本地分支强制推送到远程分支。

具体指令：

1、备份分支

```
git branch master-backup 
```

2、切换并拉取最新代码

```
git checkout master 
git pull master 
```

3、重置本地代码版本

```
git reset --hard HEAD~1
```

4、强制提交，远程端将强制跟新到reset版本 。（这一步骤可能会因为master分支受到保护而执行失败，可暂时撤销保护，完事后再设定保护）

```
git push -f origin master 
```

上一篇文章[Git总结]()