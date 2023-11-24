import { IsNotEmpty } from 'class-validator'

export class UploadDto {
  @IsNotEmpty()
  path: string
  @IsNotEmpty()
  bucket: string
}
