---
title: "java 获取视频时长和视频截图"
slug: cutvideo
date: 2019-08-15 12:20:33
category: java
tags: [java, java]
summary: "jdk本身不提供裁剪视频和解析视频的功能，但是配合ProcessBuilder可以调用外部的进程——ffmpeg去完成这些功能。ffmpeg是一款处理多媒体资源的优秀的开源工具，在官网可以下载使用。"
status: published
views: 2024
---

### 简介

jdk本身不提供裁剪视频和解析视频的功能，但是配合ProcessBuilder可以调用外部的进程——ffmpeg去完成这些功能。ffmpeg是一款处理多媒体资源的优秀的开源工具，在官网可以下载使用。本文演示windows系统下java结合ffmpeg的使用场景。

### 1. 首先需要下载ffmpeg插件

官网下载地址[https://ffmpeg.zeranoe.com/builds/]()。

[

![](https://www.freebytes.net/wp-content/uploads/2019/08/image-9-1024x226.png)

]()

选择红色框中的版本，然后下载。下载下来的东西可能有很多，但是完成所需要的截图和获取时长功能其实就只需要这两个文件——

[

![](https://static.oschina.net/uploads/space/2018/0124/203849_FnF8_3490860.png)

]()

这两个文件，建议别放在你java项目的classpath中，而是放在外部文件系统中，给程序提供正确的文件绝对路径以供使用。

### 2. 然后试试插件是否可用

[

![](https://www.freebytes.net/wp-content/uploads/2019/08/ffmpeg.png)

]()

打开cmd，依照图中的命令，进入ffmpeg的路径下，输入ffmpeg.exe  -i  视频路径地址

如果出现如下信息，表明工具可用。信息中会记载时长，开始点，文件格式，等等

### 3. 开始编程

```
  /**
     * 获取视频总时间
     *
     * @param videoPath  视频路径
     * @param ffmpegPath ffmpeg路径
     * @return
     */
    public static int getVideoTime(String videoPath, String ffmpegPath) throws Exception {
        List commands = new java.util.ArrayList();
        commands.add(ffmpegPath);
        commands.add("-i");
        commands.add(videoPath);
        //模拟cmd指令发送
        ProcessBuilder builder = new ProcessBuilder();
        builder.command(commands);
        final Process p = builder.start();

        //从输入流中读取视频信息
        BufferedReader br = new BufferedReader(new InputStreamReader(p.getErrorStream()));
        StringBuffer sb = new StringBuffer();
        String line;
        while ((line = br.readLine()) != null) {
            sb.append(line);
        }
        br.close();

        //从视频信息中解析时长
        String regexDuration = "Duration: (.*?), start: (.*?), bitrate: (\\d*) kb\\/s";
        Pattern pattern = Pattern.compile(regexDuration);
        Matcher m = pattern.matcher(sb.toString());
        if (m.find()) {
            int time = getTimelen(m.group(1));
//                System.out.println(video_path+",视频时长："+time+", 开始时间："+m.group(2)+",比特率："+m.group(3)+"kb/s");
            return time;
        }
        return 0;
    }

    //格式:"00:00:10.68" 转化为秒数
    public static int getTimelen(String timelen) {
        int min = 0;
        String strs[] = timelen.split(":");
        if (strs[0].compareTo("0") > 0) {
            min += Integer.valueOf(strs[0]) * 60 * 60;//秒
        }
        if (strs[1].compareTo("0") > 0) {
            min += Integer.valueOf(strs[1]) * 60;
        }
        if (strs[2].compareTo("0") > 0) {
            min += Math.round(Float.valueOf(strs[2]));
        }
        return min;
    }

```

```
/**
 * 获取视频第几秒的截图
 *
 * @param videoPath
 * @param ffmpegPath
 * @param time
 * @param savePath
 */
public static void getVideoCover(String videoPath, String ffmpegPath, int time, String savePath) throws Exception {
    String videoName = videoPath.substring(videoPath.lastIndexOf("\\") + 1);
    String videoCoverName = videoName.substring(0, videoName.lastIndexOf(".")) + ".jpg";
    List<String> cmd = new ArrayList<>();
    cmd.add(ffmpegPath);
    cmd.add("-i");
    cmd.add(videoPath);
    cmd.add("-y");
    cmd.add("-f");
    cmd.add("mjpeg");
    cmd.add("-ss");
    cmd.add(String.valueOf(time));
    cmd.add("-t");
    cmd.add("0.001");
    cmd.add("-s");
    cmd.add("1920*1080");
    cmd.add(savePath + "\\" + videoCoverName);
    ProcessBuilder builder = new ProcessBuilder();
    builder.command(cmd);
    builder.start();
}
```