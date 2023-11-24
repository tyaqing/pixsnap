![logo](https://github.com/tyaqing/pixsnap/assets/11229306/7ac4ae04-861f-42b9-b4e4-fa5ec06cbbb9)
# PixSnap

A Figma plugin for one-click upload of layers to cloud object storage

Documentation: [English](README.md) | [中文](README-CN.md)

Demo: [Web Application](https://pixsnap.app) | [Figma Plugin](https://www.figma.com/community/plugin/1301958586584763919/pixsnap-upload-layer-to-s3-cloudflare) | [Get A Test Token](TestToken.md)

<details>
<summary>Screenshot</summary>

Figma Plugin:
<img width="1233" alt="image" src="https://github.com/tyaqing/pixsnap/assets/11229306/cb613592-64dc-4da5-b112-7da7046ca4a5">


Web Application:
<img width="1535" alt="image" src="https://github.com/tyaqing/pixsnap/assets/11229306/75885abf-7ff7-442f-8f73-6d06721babc3">


</details>

## Highlights ✨
- Free and open source: MIT license, customizable
- Easy to use: Available on **Figma Plugin** and **Web Application**
- S3 compatible: Supports various cloud object storages: AWS S3, Tencent Cloud COS, CloudFlare R2, etc.
- Automatic compression: Supports mozjpeg, tinypng for image compression, eliminating manual compression
- Quick deployment: Can be deployed on Docker in just a few minutes
- Team use: Supports simple bucket/path/user permission configuration, log recording

## Quick Start 🚀

- Star this repository 😊
- Pull the [Docker image](https://hub.docker.com/r/yakirteng/pixsnap) `docker pull yakirteng/pixsnap`
- Configure the necessary environment variables `JWT_SECRET`, `BUCKET_CONFIG`
```bash
docker run -d -t -i \
-p 9000:9000 \
-e JWT_SECRET='your-jwt-secret' \
-e BUCKET_CONFIG='[]' \
--name pixsnap \
yakirteng/pixsnap
```
- Start the Docker service, copy the URL and JWT to the plugin or [Web Application](https://pixsnap.app)
    - You can view the JWT through `docker logs pixsnap`
    - Please note, if deployed on a remote server, you need to access it using the HTTPS protocol; for local operation, the HTTP protocol can be used.
- Upload your images 🎉

<img width="412" alt="image" src="https://github.com/tyaqing/pixsnap/assets/11229306/d7ef7ce9-53ec-4a49-97c0-c51e5ec66ed0">


## Roadmap 🗺️
- [x] Support for web upload
- [ ] Support for more cloud platforms (azure, google cloud)
- [ ] Support for more local compression formats
- [ ] Synchronous upload for the plugin
- [ ] Image format conversion (png to webp, etc.)

## Configuration Instructions 📝

### Server Environment Variables

| Constant       | Description                                                           | Default |
|----------------|-----------------------------------------------------------------------|---------|
| BUCKET_CONFIG  | Required bucket configuration, see below for format                   | -       |
| JWT_SECRET     | Required JWT secret                                                   | -       |
| TINIFY_KEY     | Optional, can be applied at [tinypng](https://tinypng.com/developers) | -       |
| WRITE_LOG      | Optional, whether to write local logs                                 | false   |
| NANO_ID_LENGTH | Optional, length of the generated file uid                            | 12      |

### BUCKET_CONFIG Configuration Instructions
The format is a JSON String, please refer to the following configuration
```js
const data = [
    {
        name: "cloudfalre r2", // optional bucket alias, can customize business name
        bucket: "cf-r2test", // required bucket name unique identifier, cannot be repeated
        region: "auto", // required region
        path: ["public","static"], // required path, allowed upload path
        cdnUrl: "https://r2cdn.pixsnap.app", // optional CDN domain name, used to generate image links
        accessKeyId: "accessKeyId", // required accessKeyId
        secretAccessKey: "secretAccessKey", // required secretAccessKey
        endpoint: "endpoint", // required endpoint
        allowedUser:["Yaqing Teng","pixsnap"] // optional, allowed upload users, based on the name field in jwt
    }
]
JSON.stringify(data)
```

### Simple Permission Configuration
JWT will be printed in docker logs, which can be directly copied to the plugin for use, with a validity period of 1 year.

If you need to deploy for team use, you can use the [simple JWT permission configuration](https://jwt.io/#debugger-io?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJwaXhzbmFwIiwibmFtZSI6IllhcWluZyBUZW5nIiwiY2xhaW1zIjp7ImFsbG93ZWQtYnVja2V0IjpbImNmLXIydGVzdCJdLCJhbGxvd2VkLXBhdGgiOlsic3RhdGljL2ltYWdlIl19LCJpYXQiOjE3MDA1NDgyMDYsImV4cCI6MTczMjA4NDIwNn0.BPMhWgQfDoO29ulrrYS8MpSHRhqG5pX11xLWnhQEH08) provided by PixSnap Server, and manually issue JWT to team members.

The rules are:
- sub: Fixed as `pixsnap`. ⚠️ If the field is not `pixsnap`, the server will assume that you have a custom authentication strategy and will not perform permission verification.
- name: Your username, can be any string. If your bucket configuration sets the `allowedUser` field, then your username must be in `allowedUser`.
- claims: Your permission configuration. If your bucket configuration sets the `allowed-bucket` or `allowed-path` field, then your permission configuration must include the `allowed-bucket` or `allowed-path` field.
    - allowed-bucket: Allowed upload bucket
    - allowed-path: Allowed upload path
- iat: The issuance time of JWT
- exp: The expiration time of JWT

For example:
User `Yaqing Teng`, only allowed to upload pictures under the `static/image` path of `cf-r2test`
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
If you need all access permissions, you can set the `allowed-bucket`, `allowed-path` fields to `*`
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

### CDN_URL Configuration Instructions

If set, the generated link is: CDN_URL/path/filename

If not set, it is: region/endpoint/path/filename

### TINIFY_KEY Configuration

> The best compression effect for png is [tinypng](https://tinypng.com/developers), but the free version only has a quota of 500 images per month

After configuration, PNG will be compressed by tinypng, and jpg format will be compressed by mozjpeg

## Deployment

It is recommended to deploy using Docker, or compile and deploy yourself.

### Pull Image

```shell
$ docker pull yakirteng/pixsnap:latest
```
### Create docker-compose.yml
For environment variables in the environment, please refer to the configuration instructions above

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
### Run
```shell
# Start
$ docker-compose up -d
# Stop
$ docker-compose down
```

## Logs
Control the opening of logs through the environment variable `WRITE_LOG=true`. Logs are written in the `logs/upload.log` directory.

When deploying with Docker, you can view logs through `docker logs`. But the logs will be deleted with the container.
You can choose to mount the log directory to the host to save logs.

```yaml
volumes:
  - /data/logs/your-custom-dir:/usr/src/app/logs
```
You can collect logs and send them to the log platform, such as ELK, etc.

## FAQ

<details>
<summary>Why is the upload successful, but the image cannot be accessed</summary>

You need to check the following points
- Whether the Bucket is set to public read permission
- Whether the Bucket has set a CDN domain name

Here we suggest that everyone use the CDN domain name to prevent back-to-source from generating high costs.

</details>


<details>
<summary>How to configure Cloudflare R2</summary>

R2's configuration is [different](https://developers.cloudflare.com/r2/api/s3/api/) from S3, you can refer to the following configuration
- REGION is fixed as `auto`
- ENDPOINT is `<ACCOUNT_ID>.r2.cloudflarestorage.com`
- CDN_URL is the Public R2.dev Bucket URL set in R2

> Please note that the R2 Bucket needs to be set to public read permission
</details>

<details>
<summary>How to apply for TINIFY_KEY</summary>

Please refer to [tinypng](https://tinypng.com/developers)

</details>

<details>
<summary>Supported Cloud Object Storage (tested)</summary>

- AWS S3
- Tencent Cloud COS
- Aliyun OSS
- Cloudflare R2

> Other object storages are being continuously verified. In fact, as long as it is S3 compatible cloud object storage, it can be used.

</details>



<details>
<summary>Supported Image Compression</summary>

- PNG: tinypng cloud compression, depends on [TINIFY_KEY](https://tinypng.com/developers)
- JPG: mozjpeg local compression

</details>

# License
[MIT licensed](LICENSE).
