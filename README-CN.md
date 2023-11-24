![logo](https://github.com/tyaqing/pixsnap/assets/11229306/7ac4ae04-861f-42b9-b4e4-fa5ec06cbbb9)

# PixSnap

一键上传图层到云对象存储的Figma插件

文档:[English](README.md) | [中文](README-CN.md)

演示: [Web应用](https://pixsnap.app) ｜ [Figma插件](https://www.figma.com/community/plugin/1301958586584763919/pixsnap-upload-layer-to-s3-cloudflare) | [获取测试Token](TestToken.md)

<details>
<summary>Screenshot</summary>

Figma插件:
<img width="1233" alt="image" src="https://github.com/tyaqing/pixsnap/assets/11229306/cb613592-64dc-4da5-b112-7da7046ca4a5">

Web应用:
<img width="1535" alt="image" src="https://github.com/tyaqing/pixsnap/assets/11229306/75885abf-7ff7-442f-8f73-6d06721babc3">

</details>



## 亮点 ✨
- 免费开源:MIT协议,可自由定制
- 使用便捷:可在**Figma插件**与**Web端**使用
- 兼容S3:支持多种云对象存储:AWS S3、腾讯云COS、CloudFlare R2 等
- 自动压缩:支持mozjpeg、tinypng压缩图片,免去手动压缩环节
- 快速部署:只需几分钟即可在 Docker 上部署
- 团队使用:支持简易bucket/path/user权限配置,日志记录

## 快速开始 🚀

- Star这个仓库😊
- 拉取[Docker镜像](https://hub.docker.com/r/yakirteng/pixsnap)`docker pull yakirteng/pixsnap`
- 配置必须的环境变量`JWT_SECRET`,`BUCKET_CONFIG` 
```bash
docker run -d -t -i \
-p 9000:9000 \
-e JWT_SECRET='your-jwt-secret' \
-e BUCKET_CONFIG='[]' \
--name pixsnap \
yakirteng/pixsnap
```
- 启动Docker服务，复制URL与JWT到插件或者[Web应用](https://pixsnap.app)中
  - 可以通过`docker logs pixsnap`来查看JWT
  - 注意,如果部署在远程服务器,需要使用https协议访问;本地运行可以使用http协议
- 上传您的图片🎉

<img width="412" alt="image" src="https://github.com/tyaqing/pixsnap/assets/11229306/d7ef7ce9-53ec-4a49-97c0-c51e5ec66ed0">

## 路线图 🗺️
- [x] 支持web上传
- [ ] 支持更多云平台(azure,google cloud)
- [ ] 本地压缩支持更多格式
- [ ] 插件上传异步改同步
- [ ] 图片格式转换(png to webp,etc.)

## 配置说明 📝

### 服务端环境变量

| 常量             | 描述                                                      | 默认    |
|----------------|---------------------------------------------------------|-------|
| BUCKET_CONFIG  | Required bucket配置，配置格式见下文                               | -     |
| JWT_SECRET     | Required JWT 密钥                                         | -     |
| TINIFY_KEY     | Optional  可在[tinypng](https://tinypng.com/developers)申请 | -     |
| WRITE_LOG      | Optional 是否写本地日志   可填入                                  | false |
| NANO_ID_LENGTH | Optional 生成文件uid的长度                                     | 12    |

### BUCKET_CONFIG 配置说明
格式为JSON String 请参考下面的配置
```js
const data = [
    {
        name: "cloudfalre r2", // optional bucket别名 可自定义业务名称
        bucket: "cf-r2test", // required bucket名称 唯一标识，不可重复
        region: "auto", // required 区域
        path: ["public","static"], // required 路径 允许上传的路径
        cdnUrl: "https://r2cdn.pixsnap.app", // optional CDN域名 用于生成图片链接
        accessKeyId: "accessKeyId", // required accessKeyId
        secretAccessKey: "secretAccessKey", // required secretAccessKey
        endpoint: "endpoint", // required endpoint
        allowedUser:["Yaqing Teng","pixsnap"] // optional 允许上传的用户 依据jwt中的name字段
    }
]
JSON.stringify(data)
```

### 简易权限配置
docker logs中会打印出JWT，可以直接复制到插件中使用，有效期为1年。

如果你需要部署给团队使用，可以使用PixSnap Server提供[简易的JWT权限配置](https://jwt.io/#debugger-io?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJwaXhzbmFwIiwibmFtZSI6IllhcWluZyBUZW5nIiwiY2xhaW1zIjp7ImFsbG93ZWQtYnVja2V0IjpbImNmLXIydGVzdCJdLCJhbGxvd2VkLXBhdGgiOlsic3RhdGljL2ltYWdlIl19LCJpYXQiOjE3MDA1NDgyMDYsImV4cCI6MTczMjA4NDIwNn0.BPMhWgQfDoO29ulrrYS8MpSHRhqG5pX11xLWnhQEH08),手动给团队成员颁发JWT。

其规则为：
- sub: 固定为`pixsnap`,⚠️字段如果不为`pixsnap`时，server认定为你有自定义的鉴权策略，不会再进行权限校验。
- name: 为你的用户名，可以是任意字符串,如果你的bucket配置中设置了`allowedUser`字段，那么你的用户名必须在`allowedUser`中。
- claims: 为你的权限配置，如果你的bucket配置中设置了`allowed-bucket`或者`allowed-path`字段，那么你的权限配置必须包含`allowed-bucket`或者`allowed-path`字段。
  - allowed-bucket: 允许上传的bucket
  - allowed-path: 允许上传的路径
- iat: 为JWT的签发时间
- exp: 为JWT的过期时间

举个列子：
用户`Yaqing Teng`，只允许上传`cf-r2test`下的`static/image`路径下的图片
```json
{
  "sub": "pixsnap",
  "name": "Yaqing Teng",
  "claims": {
    "allowed-bucket": ["cf-r2test"],
    "allowed-path": ["static/image"]
  },
  "iat": 1700548206,
  "exp": 1732084206
}
```
如果你需要所有访问权限，可以设置`allowed-bucket`,`allowed-path`字段为`*`
```json
{
  "sub": "pixsnap",
  "name": "Yaqing Teng",
  "claims": {
    "allowed-bucket": "*",
    "allowed-path": "*"
  },
  "iat": 1700548206,
  "exp": 1732084206
}
```

### CDN_URL 配置说明

如果设置,生成的链接为:CDN_URL/path/filename

如果不设置,则为: region/endpoing/path/filename

### TINIFY_KEY 配置

> png压缩效果最好的是[tinypng](https://tinypng.com/developers),但是免费版每个月只有500张的额度

配置后,PNG会交给tinypng压缩,jpg格式会交给mozjpeg压缩

## 部署

推荐使用Docker部署，或者自行编译部署。

### 拉取镜像

```shell
$ docker pull yakirteng/pixsnap:latest
```
### 创建 docker-compose.yml
environment中的环境变量,请参考上面的配置说明

```yaml
version: '3.6'
services:
  nodejs:
    image: yakirteng/pixsnap:latest
    ports:
      - "9098:9000"
    environment:
      - JWT_SECRET=your-jwt-secret
      - BUCKET_CONFIG='[your-bucket-config]'
```
### 运行
```shell
# 启动
$ docker-compose up -d
# 停止
$ docker-compose down
```

## 日志
通过环境变量 `WRITE_LOG=true`来控制开启日志。 日志写在`logs/upload.log`目录下。

Docker部署时，可以通过`docker logs`来查看日志。但是日志会随着容器的删除而删除。
您可以选择挂载日志目录到宿主机上，来保存日志。

```yaml
volumes:
  - /data/logs/your-custom-dir:/usr/src/app/logs
```
可以自行收集日志投递到日志平台，如ELK等。

## FAQ

<details>
<summary>为何上传成功，但是图片无法访问</summary>

需要检查以下几点
- Bucket是否设置为公开读取权限
- Bucket是否设置了CDN域名

这里建议大家都使用CDN域名，防止回源产生高额费用。

</details>


<details>
<summary>Cloudflare R2 如何配置</summary>

R2的几项配置与S3有[差别](https://developers.cloudflare.com/r2/api/s3/api/)，可以参考下面的配置
- REGION为固定的`auto`
- ENDPOINT为`<ACCOUNT_ID>.r2.cloudflarestorage.com`
- CDN_URL为R2 设置中的 Public R2.dev Bucket URL

> 需要注意，R2的Bucket需要设置为公开读取权限
</details>

<details>
<summary>如何申请TINIFY_KEY</summary>

请参考[tinypng](https://tinypng.com/developers)

</details>

<details>
<summary>支持的云对象存储(通过测试)</summary>

- AWS S3
- Tencent Cloud COS
- Aliyun OSS
- Cloudflare R2

> 其他对象存储在持续验证中。事实上，只要是兼容S3的云对象存储，都可以使用。

</details>



<details>
<summary>支持的图片压缩</summary>

- PNG: tinypng 云端压缩，依赖于[TINIFY_KEY](https://tinypng.com/developers)
- JPG: mozjpeg 本地压缩

</details>




# License
[MIT licensed](LICENSE).
