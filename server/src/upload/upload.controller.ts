import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Express } from 'express'
import { generateUrl, mineType2format } from '@/utils/transform'
import { UploadDto } from '@/upload/dto/upload.dto'
import { randomString } from '@/utils/string'
import { AuthGuard } from '@/common/guard/auth.guard'
import { UploadService } from '@/upload/upload.service'
import { getBucketConfigByBucket, getBucketConfigForClient } from '@/utils/checkConfig'
import * as process from 'process'

@UseGuards(AuthGuard)
@Controller()
export class UploadController {
  private readonly logger = new Logger(UploadController.name)
  constructor(private readonly uploadService: UploadService) {
    this.uploadService.initJwt()
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Body() body: UploadDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    // check access
    this.uploadService.checkAccess(req.user, body.bucket, body.path)
    const s3Config = getBucketConfigByBucket(body.bucket)
    // only keep letters, numbers, - and _ , but keep mimetype
    const originalname = file.originalname.replace(/[^a-zA-Z0-9-_.]/g, '')
    const nanoIdLength = +process.env.NANO_ID_LENGTH || 12
    const fileName = `${randomString(nanoIdLength)}-${originalname}`
    // handle compression
    const tinified = await this.uploadService.handleCompression(file)
    // upload to object storage
    await this.uploadService.upload({
      buffer: tinified,
      fileName,
      contentType: file.mimetype,
      config: s3Config,
      path: body.path,
    })
    const res = {
      name: fileName,
      originalSize: file.size,
      size: tinified.length,
      fileType: mineType2format(file.mimetype),
      src: generateUrl(fileName, s3Config, body.path),
    }
    this.logger.log({
      message: 'UploadSuccess',
      ...res,
    })
    return res
  }
  // get bucket list for client
  @Get('bucket')
  getBucketList() {
    return getBucketConfigForClient()
  }
}
