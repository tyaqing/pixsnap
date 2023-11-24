export interface BucketConfig {
  bucket: string
  region: string
  path: string[]
  cdnUrl?: string
  name?: string
  accessKeyId: string
  secretAccessKey: string
  endpoint: string
  allowedUser?: string[]
}

export function getBucketConfig(): BucketConfig[] {
  const config = process.env.BUCKET_CONFIG
  if (!config) {
    throw new Error('BUCKET_CONFIG not found')
  }
  try {
    return JSON.parse(config)
  } catch (e) {
    throw new Error('BUCKET_CONFIG parse error')
  }
}
// as response in client
export function getBucketConfigForClient(): any[] {
  const config = getBucketConfig()
  return config.map((item) => {
    return {
      bucket: item.bucket,
      region: item.region,
      path: item.path,
      cdnUrl: item.cdnUrl,
      name: item.name,
    }
  })
}

export function checkConfig() {
  const config = getBucketConfig()
  config.forEach((item) => {
    if (!item.bucket) {
      throw new Error('bucket not found')
    }
    if (!item.region) {
      throw new Error('region not found')
    }
    if (!item.path) {
      throw new Error('path not found')
    }
    if (!item.accessKeyId) {
      throw new Error('accessKeyId not found')
    }
    if (!item.secretAccessKey) {
      throw new Error('secretAccessKey not found')
    }
    if (!item.endpoint) {
      throw new Error('endpoint not found')
    }
  })
  // check JWT_SECRET
  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret) {
    throw new Error('JWT_SECRET not found')
  }
}

export function getBucketConfigByBucket(bucket: string): BucketConfig {
  const config = getBucketConfig()
  const res = config.find((item) => item.bucket === bucket)
  if (!res) {
    throw new Error('bucket not found')
  }
  return res
}
