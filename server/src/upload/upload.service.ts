import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { BucketConfig, getBucketConfigByBucket } from '@/utils/checkConfig'
import { PutObjectCommandOutput, S3 } from '@aws-sdk/client-s3'
import { squooshCompression, tinifyCompression, tinifyInstance } from '@/utils/compression'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name)
  constructor(private readonly jwtService: JwtService) {}
  async upload({
    buffer,
    fileName,
    contentType,
    config,
    path,
  }: {
    buffer: Uint8Array
    fileName: string
    contentType: string
    config: BucketConfig
    path: string
  }): Promise<PutObjectCommandOutput> {
    const s3 = new S3({
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      region: config.region,
      endpoint: config.endpoint.startsWith('http') ? config.endpoint : 'https://' + config.endpoint,
    })
    const res = await s3
      .putObject({
        Bucket: config.bucket,
        Key: path + '/' + fileName,
        Body: buffer,
        ContentType: contentType,
      })
      .catch((e) => {
        this.logger.error({
          message: 'upload to s3 error',
          error: e,
        })
        throw new BadRequestException(e.message, {
          description: 'upload to s3 error',
          cause: e,
        })
      })
    this.logger.log({
      message: 's3Response',
      s3Res: res,
    })
    return res
  }
  async handleCompression(file: Express.Multer.File): Promise<Uint8Array> {
    let tinified: Uint8Array
    switch (file.mimetype) {
      case 'image/jpeg':
      case 'image/jpg':
        {
          tinified = await squooshCompression(file.buffer)
        }
        break
      case 'image/png':
        {
          tinified = await tinifyCompression(file.buffer)
          this.logger.log({
            message: 'TinifyCompressionCount',
            compressionCount: tinifyInstance.compressionCount,
          })
        }
        break
      case 'image/svg+xml':
      case 'image/svg':
        {
          file.mimetype = 'image/svg+xml'
          tinified = new Uint8Array(file.buffer)
        }
        break
      default: {
        throw new Error('unsupported file type')
      }
    }
    return tinified
  }
  checkAccess(jwtPayload: any, bucket: string, path: string) {
    const { sub, claims, user } = jwtPayload
    // you can add your own access control logic here
    if (sub === 'pixsnap') {
      const config = getBucketConfigByBucket(bucket)
      // 1. bucket in config
      if (!config) {
        throw new BadRequestException(`bucket:${bucket} not found`)
      }
      // 2. allowed-bucket in claims
      if (Array.isArray(claims['allowed-bucket']) && !claims['allowed-bucket'].includes(bucket)) {
        throw new BadRequestException(`bucket:${bucket} not allowed`)
      }
      // 3. allowed-path in claims
      if (Array.isArray(claims['allowed-path']) && !claims['allowed-path'].includes(path)) {
        throw new BadRequestException(`path:${path} not allowed`)
      }
      // 4. allowedUser in config
      if (config.allowedUser && !config.allowedUser.includes(user)) {
        throw new BadRequestException(`user:${user} not allowed`)
      }
    }
  }
  initJwt() {
    const jwt = this.jwtService.sign(
      { sub: 'pixsnap', claims: { 'allowed-bucket': '*', 'allowed-path': '*' }, user: 'pixsnap' },
      {
        // default 1 year
        expiresIn: '365d',
      },
    )
    setTimeout(() => {
      console.log('-----------------------------JWT START-------------------------------')
      console.log(jwt)
      console.log('-----------------------------JWT   END-------------------------------')
    })
  }
}
