---
title: "openresty实现文件上传、删除和用户认证"
slug: openresty-upload-java
date: 2019-12-14 06:50:19
category: java
tags: [java, java, Nginx, openresty]
summary: "本文讲解在centos系统使用openresty，并实现基本的用户认证和文件访问、上传、删除的功能。"
status: published
views: 3730
---

### 简介

本文讲解在centos系统使用openresty，并实现基本的用户认证和文件访问、上传、删除的功能。

### 安装openresty所需环境

openresty本质上还是个nginx，所以安装openresty需要有nginx的环境，如果服务器没有安装过nginx，请参考[《Nginx从安装到配置》]()一文中的“安装所需环境”一节，安装nginx所需要的环境。  

### 下载openresty安装包 

可在官方页面[http://openresty.org/cn/download.html]()下载最新的版本。下载后解压：tar -zxvf xxx.tar.gz 

### 配置openresty

我解压后的目录在/home/freebytes/work/openresty，进入目录后运行：

```
 ./configure  \
--prefix= /home/freebytes/work/imoon/openresty            \  
--with-luajit 
```

--prefix将安装目录设置到自定义位置。接着运行:

> 

make

> 

make install  

OK，在/home/freebytes/work/imoon/openresty下将会出现所有需要的文件。如果卸载，那就把这个文件删了就行了。
在安装目录下输入ls，可以看到——

![](https://www.freebytes.net/wp-content/uploads/2019/11/image-9.png)

这里的nginx目录，其实跟正常安装nginx之后产生的安装目录是一样的。nginx目录下是这些熟悉的文件——

![](https://www.freebytes.net/wp-content/uploads/2019/11/image-10.png)

### 运行openresty

注意，之后的所有文件操作都是基于这个目录下面 /home/freebytes/work/imoon/openresty

运行openresty其实就是运行nginx，我们可以看到openresty目录下有个nginx目录，里面有运行文件和配置文件，现在先配置一下nginx，所以输入：
vi  ./nginx/conf/nginx.conf
编辑文本，只需如下代码：

```
user  freebytes（这里写你自己的用户名）;
worker_processes  1; 
error_log logs/error.log; 
events {     
     worker_connections 1024; 
     } 
http {     
     server {         
          listen 80;         
          location / {             
                  default_type text/html;             
                  content_by_lua_block {                 
                       ngx.say("<p>hello, world</p>")             
                  }         
          }     
      }
} 
```

在当前目录下运行指令：

> 

 ./nginx/sbin/nginx   

如此便可启动openresty。重载的命令是  ./nginx/sbin/nginx  -s reload  ，停止的命令是  ./nginx/sbin/nginx   -s  stop 。

当然你也可以通过执行bin目录中的名为“openresty”的文件来启动openresty，但它本质上还是链接到了nginx的启动文件，所以其实都是一样的。

然后，在浏览器输入http://localhost:80，应显示：hello，word 。 则成功！

### 配置上传、删除文件功能

简单地来说，你可以把openresty理解成nginx+lua脚本。也就是nginx将业务处理逻辑交给了lua去做。因此，我们在openresty上实现上传和删除的功能理应是这样的流程：

1. 编辑nginx.conf文本，配置两个location，一个对应上传请求，一个对应删除请求。
2. 编写两个lua脚本，一个处理上传，一个处理删除。
3. 在对应上传请求的location中，引入上传脚本，将上传请求交给lua去处理； 在对应删除请求的location中，引入删除脚本，将删除请求交给lua去处理 。

因此我们要做的第一步就是， 将刚才的nginx.conf文本的http模块替换如下：

```
http {
    include       mime.types;
    default_type  application/octet-stream;
    charset utf-8;
    server {
        listen       80;
        server_name  localhost;
        # 最大允许上传的文件大小
        client_max_body_size 400m;       
        
        location / {
            root   html;
            index  index.html index.htm;
        }

# 设置文件存储路径给变量$store_dir，这个变量值会传递到lua中
         set $store_dir "/home/freebytes/work/imoon/openresty/nginx/html/file/all/"; 
         
# 文件上传接口：http://xxx:80/file/upload
        location /file/upload {
            #这里实现用户认证 暂不使用 所以注释掉
            # auth_basic "input your password";
            # auth_basic_user_file auth.user;
            # 这里配置上传脚本，实现文件上传的逻辑
            content_by_lua_file /home/freebytes/work/imoon/openresty/lualib/resty/freebytes_upload.lua; 
        }

# 文件删除接口：http://xxx:80/file/delete 
        location /file/delete {
                #这里实现用户认证 暂不使用 所以注释掉
		# auth_basic "please input your password";
            	# auth_basic_user_file auth.user;
                # 这里配置删除脚本，实现文件删除的逻辑		
	     	content_by_lua_file /home/freebytes/work/imoon/openresty/lualib/resty/freebytes_delete.lua;
	}

# 文件访问、下载入口: http://xxx:80/file/all
        location /file/all{
            autoindex on;
            autoindex_localtime on;
            root   html;
            index  index.html;
        }

        # redirect server error pages to the static page /50x.html
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
}
```

配置文件中，设置了三个location，分别用于文件上传、删除、访问下载。并且，设置了文件的存储路径为/home/freebytes/work/imoon/openresty/nginx/html/file/all，因此我要建立这个文件夹：

> 

 mkdir  /home/freebytes/work/imoon/openresty/nginx/html/file/all 

并将 file文件夹及其子文件夹的权限拥有者变成freebytes用户，以避免文件读写的权限问题。 

> 

 chown -R freebytes:freebytes   /home/freebytes/work/imoon/openresty/nginx/html/file/  

第二步，准备文件上传处理、删除处理的lua脚本，将脚本放在/home/freebytes/work/imoon/openresty/lualib/resty目录下面，因为我在上面的nginx.conf中已经配置好了路径。这里提供一份标准的上传脚本和一份标准的删除脚本：

```
-- freebytes_upload.lua
--==========================================
-- 文件上传
--==========================================
local upload = require "resty.upload"
local cjson = require "cjson"
local chunk_size = 4096
local form, err = upload:new(chunk_size)
if not form then
    ngx.log(ngx.ERR, "failed to new upload: ", err)
    ngx.exit(ngx.HTTP_INTERNAL_SERVER_ERROR)
end
form:set_timeout(1000)
-- 字符串 split 分割
string.split = function(s, p)
    local rt= {}
    string.gsub(s, '[^'..p..']+', function(w) table.insert(rt, w) end )
    return rt
end
-- 支持字符串前后 trim
string.trim = function(s)
    return (s:gsub("^%s*(.-)%s*$", "%1"))
end
-- 文件保存的根路径
local saveRootPath = ngx.var.store_dir
-- 保存的文件对象
local fileToSave
--文件是否成功保存
local ret_save = false
while true do
    local typ, res, err = form:read()
    if not typ then
        ngx.say("failed to read: ", err)
        return
    end
    if typ == "header" then
        -- 开始读取 http header
        -- 解析出本次上传的文件名
        local key = res[1]
        local value = res[2]
        if key == "Content-Disposition" then
            -- 解析出本次上传的文件名
            -- form-data; name="testFileName"; filename="testfile.txt"
            local kvlist = string.split(value, ';')
            for _, kv in ipairs(kvlist) do
                local seg = string.trim(kv)
                if seg:find("filename") then
                    local kvfile = string.split(seg, "=")
                    local filename = string.sub(kvfile[2], 2, -2)
                    if filename then
                        fileToSave = io.open(saveRootPath .. filename, "w+")
                        if not fileToSave then
                            ngx.say("failed to open file ", filename)
                            return
                        end
                        break
                    end
                end
            end
        end
    elseif typ == "body" then
        -- 开始读取 http body
        if fileToSave then
            fileToSave:write(res)
        end
    elseif typ == "part_end" then
        -- 文件写结束，关闭文件
        if fileToSave then
            fileToSave:close()
            fileToSave = nil
        end
         
        ret_save = true
    elseif typ == "eof" then
        -- 文件读取结束
        break
    else
        ngx.log(ngx.INFO, "do other things")
    end
end
if ret_save then
    ngx.say("save file ok")
end
```

```
--==========================================
-- 文件删除 freebytes_delete.lua
--==========================================

local upload = require "resty.upload"
local cjson = require "cjson"

-- 获取http请求的所有参数 
local args = ngx.req.get_uri_args()
if not args then
    ngx.exit(ngx.HTTP_BAD_REQUEST)
end

local filename = args["filename"] or "noname.file"
local billingcode = args["billingcode"] or ""
local filetype = args["type"]

local response = {["code"] = 200, ["msg"] = "remove success!"} 

-- 保存文件根目录
local save_file_root = ngx.var.store_dir

-- 确定删除文件路径
local remove_file_path = save_file_root

remove_file  = remove_file_path .. "/" .. filename

-- 判断删除文件是否存在
local dfile = io.open(remove_file, "rb")
if dfile then
    dfile:close()
else
    response.code = 403
    response.msg = "the remove file is not exist!"
    ngx.say(cjson.encode(response))
    return
end

-- 执行删除
local res, err = os.remove(remove_file)
if not res then
    response.code = 404
    response.msg = "failed to remove " .. remove_file .. ", err: " .. (err or '')
else
   ngx.log(ngx.ERR, "success to remove file: " .. remove_file)
end

ngx.say(cjson.encode(response))
```

此时，重启nginx，浏览器访问 http://localhost:80/file/all/ , 如果出现如下画面，就证明文件访问请求没有问题。

![](https://www.freebytes.net/wp-content/uploads/2019/11/image-11.png)

再利用postman工具测试文件上传接口。

[

![](https://www.freebytes.net/wp-content/uploads/2019/12/image-9.png)

]()

上图是上传接口的测试，可以看到返回数据为 save file ok ， 表明上传成功。测试再访问 /file/all，就会看到已经存在一个文件了——

[

![](https://www.freebytes.net/wp-content/uploads/2019/12/image-10.png)

]()

继续测试删除接口 /file/delete?filename=xxx：

![](https://www.freebytes.net/wp-content/uploads/2019/12/image-11.png)

删除接口测试成功，然后再看/file/all，就会发现刚才那个文件已经被删了。

此时，openresty已经具备了文件上传、访问（下载）、删除功能。

### 配置用户认证功能

文件的上传和删除请求，理应都需要用户认证来保证安全性。openresty的用户认证功能，可以通过配置nginx的用户认证来实现。先利用htppd工具生成密码文件：

```
#安装工具
yum -y install httpd-tools  
#进入conf目录
cd ./nginx/conf
#生成密码文件，用户名是freebytes，密码需要手动输入
htpasswd -c auth.user freebytes 
```

此时会在nignx/conf目录下生成一个auth.user文件，内容是这样的:

```
freebytes:$apr1$mxIfqNJF$twGmXQsbS/ykHhl0aa4Al/
```

前者是用户名，后者是加密后的密码。

然后再来改一下nginx.conf文件，也就是在对应上传请求和删除请求的location中， 把刚刚注释掉的两段有关认证的代码的注释符号去掉——

[

![](https://www.freebytes.net/wp-content/uploads/2019/12/image-12.png)

]()

所以现在的完整的具备文件上传、删除、访问下载和用户认证功能的nginx.conf是这样的——

```
http {
    include       mime.types;
    default_type  application/octet-stream;
    charset utf-8;
    server {
        listen       80;
        server_name  localhost;
        # 最大允许上传的文件大小
        client_max_body_size 400m;       
        
        location / {
            root   html;
            index  index.html index.htm;
        }

# 设置文件存储路径给变量$store_dir，这个变量值会传递到lua中
         set $store_dir "/home/freebytes/work/imoon/openresty/nginx/html/file/all/"; 
         
# 文件上传接口：http://xxx:80/file/upload
        location /file/upload {
            #这里实现用户认证 
             auth_basic "input your password";
             auth_basic_user_file auth.user;
            # 这里配置上传脚本，实现文件上传的逻辑
            content_by_lua_file /home/freebytes/work/imoon/openresty/lualib/resty/freebytes_upload.lua; 
        }

# 文件删除接口：http://xxx:80/file/delete 
        location /file/delete {
                #这里实现用户认证 
		auth_basic "please input your password";
            	auth_basic_user_file auth.user;
                # 这里配置删除脚本，实现文件删除的逻辑		
	     	content_by_lua_file /home/freebytes/work/imoon/openresty/lualib/resty/freebytes_delete.lua;
	}

# 文件访问、下载入口: http://xxx:80/file/all
        location /file/all{
            autoindex on;
            autoindex_localtime on;
            root   html;
            index  index.html;
        }

        # redirect server error pages to the static page /50x.html
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
}
```

重载nginx ，然后用postman重新访问上传和删除接口，就会发现报401错误——

[

![](https://www.freebytes.net/wp-content/uploads/2019/12/image-13.png)

]()

用浏览器访问会要求你输入用户名和密码；但是文件访问接口/file/all是正常的。那么怎样才能正常访问到上传和删除接口呢？

nginx的用户认证是基于http的基本认证，所以访问nignx的请求中需要带有 Authorization 请求头。利用postman很容易构建 Authorization  请求头——

[

![](https://www.freebytes.net/wp-content/uploads/2019/12/image-15.png)

]()

如此配置，发出的的请求中就会带上 Authorization 请求头，key值是Authorization，value值是用户名和密码经过base64加密后的字符串。

[

![](https://www.freebytes.net/wp-content/uploads/2019/12/image-16.png)

]()

这样，再次请求上传和删除接口，都能正常了。

### java访问openresty的文件上传和删除功能

上文对于openresty的功能测试，都是利用postman工具完成的。但是如果需要在web系统中用到这些功能，还是需要一个java构建的客户端的。下面提供一个标准的java类及其所需依赖，具备文件上传和删除功能——

```
<dependency>
    <groupId>org.apache.httpcomponents</groupId>
    <artifactId>httpclient</artifactId>
    <version>4.5.3</version>
</dependency>
<dependency>
    <groupId>org.apache.httpcomponents</groupId>
    <artifactId>httpmime</artifactId>
    <version>4.5.3</version>
</dependency>
```

```
import org.apache.http.HttpEntity;
import org.apache.http.NameValuePair;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import javax.xml.bind.DatatypeConverter;
import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;

/**
 * 千里 • 明月
 * freebytes.net
 */
public class ToOpenresty {

    private String requestUrl;
    private String filename;
    private String authUser;
    private String authPassword;

    private int connectTimeout = 10000;
    private int socketTimeout = 10000;

    public ToOpenresty(String requestUrl, String filename, String authUser, String authPassword) {
        this.requestUrl = requestUrl;
        this.filename = filename;
        this.authUser = authUser;
        this.authPassword = authPassword;
    }

    public static void main(String[] args) {
        //上传文件
        ToOpenresty upload = new ToOpenresty("http://192.168.50.41:80/file/upload",
                "F:\\1500945430967.jpg", "freebytes", "123456");
        upload.uploadToOpenresty();

        //删除文件
//        ToOpenresty delete = new ToOpenresty("http://192.168.50.41:80/file/delete",
        "1500945430967.jpg", "freebytes", "123456");
//        delete.deleteByFilename();
    }

    /**
     * 上传接口
     */
    public void uploadToOpenresty() {
        CloseableHttpClient httpclient = HttpClients.createDefault();
        CloseableHttpResponse response = null;
        try {
            HttpPost httppost = new HttpPost(requestUrl);
            RequestConfig requestConfig = RequestConfig.custom().setConnectTimeout(connectTimeout).setSocketTimeout(socketTimeout).build();
            httppost.setConfig(requestConfig);
            FileBody bin = new FileBody(new File(filename));
            HttpEntity reqEntity = MultipartEntityBuilder.create().addPart("file", bin).build();
            httppost.setEntity(reqEntity);
            String authorization = DatatypeConverter.printBase64Binary((authUser + ":" + authPassword).getBytes("UTF-8"));
            httppost.setHeader("Authorization", "Basic " + authorization);
            System.out.println("执行http请求-- " + httppost.getRequestLine());
            response = httpclient.execute(httppost);
            System.out.println("http响应状态行--" + response.getStatusLine());
            HttpEntity resEntity = response.getEntity();
            EntityUtils.consume(resEntity);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                response.close();
                httpclient.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * 删除接口
     */
    public void deleteByFilename() {
        CloseableHttpClient httpclient = HttpClients.createDefault();
        List<NameValuePair> params = new ArrayList<>();
        params.add(new BasicNameValuePair("filename", filename));
        HttpGet httpGet = null;
        CloseableHttpResponse response = null;
        try {
            httpGet = new HttpGet(new URIBuilder(new URI(requestUrl)).setParameters(params).build());
            RequestConfig requestConfig = RequestConfig.custom().setConnectTimeout(connectTimeout).setSocketTimeout(socketTimeout).build();
            httpGet.setConfig(requestConfig);
            String authorization = DatatypeConverter.printBase64Binary((authUser + ":" + authPassword).getBytes("UTF-8"));
            //构建Authorization请求头
            httpGet.setHeader("Authorization", "Basic " + authorization);
            System.out.println("执行http请求-- " + httpGet.getRequestLine());
            response = httpclient.execute(httpGet);
            System.out.println("http响应状态行--" + response.getStatusLine());
            HttpEntity resEntity = response.getEntity();
            EntityUtils.consume(resEntity);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                response.close();
                httpclient.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
```